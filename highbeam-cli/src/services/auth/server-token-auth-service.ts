import type { Env } from "shared/env/env";
import { logger } from "../logger";

import type { AuthService } from "./auth-service";
import type { AuthTokenStore } from "./auth-token-store";

const TOKEN_REFRESH_BUFFER_MS = 45_000;
const POLL_INTERVAL_MS = 500;
const POLL_TIMEOUT_MS = 30_000;

export class ServerTokenAuthService implements AuthService {
  // Constructor
  public constructor(env: Env, tokenStore: AuthTokenStore) {
    this.env = env;
    this.tokenStore = tokenStore;
  }

  // Properties (public)

  // Properties (private)
  private readonly env: Env;
  private readonly tokenStore: AuthTokenStore;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private expiresAt = 0;
  private refreshTimer: ReturnType<typeof setTimeout> | null = null;

  // Lifecycle (start, dispose, etc.)
  public dispose(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  // Public methods
  /**
   * Attempt to load a valid token from the shared file store.
   * Returns true if a usable token was found, false otherwise.
   */
  public tryLoadFromFile(): boolean {
    const persisted = this.tokenStore.read();
    if (!persisted) return false;
    if (persisted.status === "refreshing") return false;
    if (persisted.expiresAt <= Date.now() + TOKEN_REFRESH_BUFFER_MS) return false;

    this.accessToken = persisted.accessToken;
    this.refreshToken = persisted.refreshToken ?? null;
    this.expiresAt = persisted.expiresAt;
    this.scheduleRefresh();

    logger.info(
      `[auth] Loaded token from file — expires at ${new Date(this.expiresAt).toLocaleString()}`,
    );
    return true;
  }

  public setTokens(params: {
    accessToken: string;
    refreshToken?: string;
    expiresIn: number;
  }): void {
    this.accessToken = params.accessToken;
    if (params.refreshToken) {
      this.refreshToken = params.refreshToken;
    }
    this.expiresAt = Date.now() + params.expiresIn * 1000;

    logger.info(
      `[auth] Token set — expires in ${params.expiresIn}s (at ${new Date(this.expiresAt).toLocaleString()})`,
    );
    if (this.refreshToken) {
      logger.info("[auth] Refresh token available — auto-refresh enabled");
    } else {
      logger.warn("[auth] No refresh token — token will NOT auto-refresh");
    }

    this.persistToFile();
    this.scheduleRefresh();
  }

  /**
   * Try to load a valid token from file. If the token is expired but a
   * refresh token is available, attempt to refresh it. Returns true if
   * a usable token is available afterwards.
   */
  public async tryLoadOrRefresh(): Promise<boolean> {
    if (this.tryLoadFromFile()) return true;

    // Token wasn't valid — check if we can refresh
    const persisted = this.tokenStore.read();
    if (!persisted?.refreshToken) return false;

    // Populate the refresh token so doRefresh can use it
    this.refreshToken = persisted.refreshToken;

    try {
      await this.doRefresh();
      return this.isAuthenticated;
    } catch (err) {
      logger.error("[auth] Token refresh failed:", err);
      return false;
    }
  }

  public get isAuthenticated(): boolean {
    return this.accessToken !== null;
  }

  public getAccessToken(_authorizationHeader: string | undefined): string | null {
    return this.accessToken;
  }

  // Private methods
  private persistToFile(): void {
    this.tokenStore.write({
      accessToken: this.accessToken!,
      refreshToken: this.refreshToken ?? undefined,
      expiresAt: this.expiresAt,
      status: "ready",
      updatedAt: Date.now(),
    });
  }

  private scheduleRefresh(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }
    if (!this.refreshToken) return;

    const delay = Math.max(0, this.expiresAt - Date.now() - TOKEN_REFRESH_BUFFER_MS);
    logger.info(`[auth] Scheduling token refresh in ${Math.round(delay / 1000)}s`);

    this.refreshTimer = setTimeout(() => {
      this.doRefresh().catch((err) => {
        logger.error("[auth] Token refresh failed:", err);
      });
    }, delay);
  }

  private async doRefresh(): Promise<void> {
    if (!this.refreshToken) {
      logger.warn("[auth] Cannot refresh — no refresh token");
      return;
    }

    // Check if another process already refreshed
    const persisted = this.tokenStore.read();
    if (
      persisted &&
      persisted.status === "ready" &&
      persisted.expiresAt > Date.now() + TOKEN_REFRESH_BUFFER_MS
    ) {
      this.adoptFromFile(persisted);
      logger.info("[auth] Adopted token refreshed by another process");
      return;
    }

    // Try to acquire the refresh lock
    if (!this.tokenStore.acquireLock()) {
      logger.info("[auth] Another process is refreshing — waiting for completion");
      if (await this.waitForRefreshAndAdopt()) return;
      logger.warn("[auth] Timed out waiting for other process, proceeding with own refresh");
    }

    logger.info("[auth] Refreshing access token...");

    const tokenUrl = new URL("/oauth/token", this.env.HIGHBEAM_AUTH_ORIGIN);
    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type: "refresh_token",
        client_id: this.env.AUTH0_CLIENT_ID,
        refresh_token: this.refreshToken,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Auth0 token refresh failed (${response.status}): ${body}`);
    }

    const data = (await response.json()) as {
      access_token: string;
      refresh_token?: string;
      expires_in: number;
    };

    this.accessToken = data.access_token;
    if (data.refresh_token) {
      this.refreshToken = data.refresh_token;
    }
    this.expiresAt = Date.now() + data.expires_in * 1000;

    logger.info(
      `[auth] Token refreshed — expires in ${data.expires_in}s (at ${new Date(this.expiresAt).toLocaleString()})`,
    );

    this.tokenStore.releaseLock({
      accessToken: this.accessToken!,
      refreshToken: this.refreshToken ?? undefined,
      expiresAt: this.expiresAt,
      status: "ready",
      updatedAt: Date.now(),
    });

    this.scheduleRefresh();
  }

  private adoptFromFile(persisted: {
    accessToken: string;
    refreshToken: string | undefined;
    expiresAt: number;
  }): void {
    this.accessToken = persisted.accessToken;
    this.refreshToken = persisted.refreshToken ?? null;
    this.expiresAt = persisted.expiresAt;
    this.scheduleRefresh();
  }

  private async waitForRefreshAndAdopt(): Promise<boolean> {
    const deadline = Date.now() + POLL_TIMEOUT_MS;

    while (Date.now() < deadline) {
      await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
      const persisted = this.tokenStore.read();
      if (
        persisted &&
        persisted.status === "ready" &&
        persisted.expiresAt > Date.now() + TOKEN_REFRESH_BUFFER_MS
      ) {
        this.adoptFromFile(persisted);
        logger.info("[auth] Adopted token refreshed by another process");
        return true;
      }
    }

    return false;
  }
}

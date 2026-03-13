import { logger } from "../logger";

import type { GoogleTokenStore, PersistedGoogleToken } from "./google-token-store";

const TOKEN_REFRESH_BUFFER_MS = 45_000;
const POLL_INTERVAL_MS = 500;
const POLL_TIMEOUT_MS = 30_000;

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";

export class GoogleService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private expiresAt = 0;
  private refreshTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private readonly clientId: string,
    private readonly clientSecret: string,
    private readonly tokenStore: GoogleTokenStore,
  ) {}

  tryLoadFromFile(): boolean {
    const persisted = this.tokenStore.read();
    if (!persisted) return false;
    if (persisted.status === "refreshing") return false;
    if (persisted.expiresAt <= Date.now() + TOKEN_REFRESH_BUFFER_MS) return false;

    this.accessToken = persisted.accessToken;
    this.refreshToken = persisted.refreshToken ?? null;
    this.expiresAt = persisted.expiresAt;
    this.scheduleRefresh();

    logger.info(
      `[google] Loaded token from file — expires at ${new Date(this.expiresAt).toLocaleString()}`,
    );
    return true;
  }

  setTokens(params: {
    accessToken: string;
    refreshToken?: string;
    expiresIn: number;
    scope: string;
  }): void {
    this.accessToken = params.accessToken;
    if (params.refreshToken) {
      this.refreshToken = params.refreshToken;
    }
    this.expiresAt = Date.now() + params.expiresIn * 1000;

    logger.info(
      `[google] Token set — expires in ${params.expiresIn}s (at ${new Date(this.expiresAt).toLocaleString()})`,
    );
    if (this.refreshToken) {
      logger.info("[google] Refresh token available — auto-refresh enabled");
    } else {
      logger.warn("[google] No refresh token — token will NOT auto-refresh");
    }

    this.persistToFile(params.scope);
    this.scheduleRefresh();
  }

  async tryLoadOrRefresh(): Promise<boolean> {
    if (this.tryLoadFromFile()) return true;

    const persisted = this.tokenStore.read();
    if (!persisted?.refreshToken) return false;

    this.refreshToken = persisted.refreshToken;

    try {
      await this.doRefresh(persisted.scope);
      return this.isAuthenticated;
    } catch (err) {
      logger.error("[google] Token refresh failed:", err);
      return false;
    }
  }

  get isAuthenticated(): boolean {
    return this.accessToken !== null;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  dispose(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  private persistToFile(scope: string): void {
    this.tokenStore.write({
      accessToken: this.accessToken!,
      refreshToken: this.refreshToken ?? undefined,
      expiresAt: this.expiresAt,
      scope,
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
    logger.info(`[google] Scheduling token refresh in ${Math.round(delay / 1000)}s`);

    this.refreshTimer = setTimeout(() => {
      const persisted = this.tokenStore.read();
      this.doRefresh(persisted?.scope ?? "").catch((err) => {
        logger.error("[google] Token refresh failed:", err);
      });
    }, delay);
  }

  private async doRefresh(scope: string): Promise<void> {
    if (!this.refreshToken) {
      logger.warn("[google] Cannot refresh — no refresh token");
      return;
    }

    const persisted = this.tokenStore.read();
    if (
      persisted &&
      persisted.status === "ready" &&
      persisted.expiresAt > Date.now() + TOKEN_REFRESH_BUFFER_MS
    ) {
      this.adoptFromFile(persisted);
      logger.info("[google] Adopted token refreshed by another process");
      return;
    }

    if (!this.tokenStore.acquireLock()) {
      logger.info("[google] Another process is refreshing — waiting for completion");
      if (await this.waitForRefreshAndAdopt()) return;
      logger.warn("[google] Timed out waiting for other process, proceeding with own refresh");
    }

    logger.info("[google] Refreshing access token...");

    const response = await fetch(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        client_id: this.clientId,
        client_secret: this.clientSecret,
        refresh_token: this.refreshToken,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Google token refresh failed (${response.status}): ${body}`);
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
      `[google] Token refreshed — expires in ${data.expires_in}s (at ${new Date(this.expiresAt).toLocaleString()})`,
    );

    this.tokenStore.releaseLock({
      accessToken: this.accessToken!,
      refreshToken: this.refreshToken ?? undefined,
      expiresAt: this.expiresAt,
      scope,
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
        logger.info("[google] Adopted token refreshed by another process");
        return true;
      }
    }

    return false;
  }
}

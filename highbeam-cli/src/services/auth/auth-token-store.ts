import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { logger } from "../logger";

export interface PersistedAuthToken {
  accessToken: string;
  refreshToken: string | undefined;
  expiresAt: number;
  status: "ready" | "refreshing";
  updatedAt: number;
}

const STALE_LOCK_MS = 60_000;

export class AuthTokenStore {
  private readonly filePath: string;

  constructor(storagePath: string) {
    mkdirSync(storagePath, { recursive: true });
    this.filePath = resolve(storagePath, "auth-token.json");
  }

  read(): PersistedAuthToken | null {
    if (!existsSync(this.filePath)) return null;
    try {
      return JSON.parse(readFileSync(this.filePath, "utf-8")) as PersistedAuthToken;
    } catch {
      return null;
    }
  }

  write(token: PersistedAuthToken): void {
    try {
      writeFileSync(this.filePath, JSON.stringify(token, null, 2));
    } catch (err) {
      logger.error("[auth-store] Failed to write token file:", err);
    }
  }

  /**
   * Attempt to acquire the refresh lock.
   * Returns true if the lock was acquired (status set to "refreshing").
   * Returns false if another process is actively refreshing.
   */
  acquireLock(): boolean {
    const existing = this.read();

    if (existing && existing.status === "refreshing") {
      const age = Date.now() - existing.updatedAt;
      if (age < STALE_LOCK_MS) {
        return false;
      }
      logger.warn("[auth-store] Stale refresh lock detected, overriding");
    }

    this.write({
      accessToken: existing?.accessToken ?? "",
      refreshToken: existing?.refreshToken,
      expiresAt: existing?.expiresAt ?? 0,
      status: "refreshing",
      updatedAt: Date.now(),
    });

    return true;
  }

  /**
   * Release the lock by writing the new token with status "ready".
   */
  releaseLock(token: PersistedAuthToken): void {
    this.write({ ...token, status: "ready", updatedAt: Date.now() });
  }
}

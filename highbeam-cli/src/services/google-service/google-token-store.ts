import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { logger } from "../logger";

export interface PersistedGoogleToken {
  accessToken: string;
  refreshToken: string | undefined;
  expiresAt: number;
  scope: string;
  status: "ready" | "refreshing";
  updatedAt: number;
}

const STALE_LOCK_MS = 60_000;

export class GoogleTokenStore {
  private readonly filePath: string;

  constructor(storagePath: string) {
    mkdirSync(storagePath, { recursive: true });
    this.filePath = resolve(storagePath, "google-token.json");
  }

  read(): PersistedGoogleToken | null {
    if (!existsSync(this.filePath)) return null;
    try {
      return JSON.parse(readFileSync(this.filePath, "utf-8")) as PersistedGoogleToken;
    } catch {
      return null;
    }
  }

  write(token: PersistedGoogleToken): void {
    try {
      writeFileSync(this.filePath, JSON.stringify(token, null, 2));
    } catch (err) {
      logger.error("[google-store] Failed to write token file:", err);
    }
  }

  acquireLock(): boolean {
    const existing = this.read();

    if (existing && existing.status === "refreshing") {
      const age = Date.now() - existing.updatedAt;
      if (age < STALE_LOCK_MS) {
        return false;
      }
      logger.warn("[google-store] Stale refresh lock detected, overriding");
    }

    this.write({
      accessToken: existing?.accessToken ?? "",
      refreshToken: existing?.refreshToken,
      expiresAt: existing?.expiresAt ?? 0,
      scope: existing?.scope ?? "",
      status: "refreshing",
      updatedAt: Date.now(),
    });

    return true;
  }

  releaseLock(token: PersistedGoogleToken): void {
    this.write({ ...token, status: "ready", updatedAt: Date.now() });
  }
}

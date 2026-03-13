import type { Logger } from "./Logger";

export type LogLevel = "info" | "warn" | "error";

export interface LogEntry {
  id: number;
  level: LogLevel;
  timestamp: string;
  args: unknown[];
}

function timestamp(): string {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  const s = String(now.getSeconds()).padStart(2, "0");
  const ms = String(now.getMilliseconds()).padStart(3, "0");
  return `${h}:${m}:${s}.${ms}`;
}

/**
 * Logger implementation for the Ink terminal UI.
 *
 * Stores log entries in memory so Ink components can render them
 * reactively via `<Static>`. Exposes a `useSyncExternalStore`-compatible
 * subscribe/getSnapshot API.
 */
export class InkLogger implements Logger {
  private nextId = 0;
  private entries: LogEntry[] = [];
  private listeners = new Set<() => void>();

  info(...args: unknown[]): void {
    this.push("info", args);
  }

  warn(...args: unknown[]): void {
    this.push("warn", args);
  }

  error(...args: unknown[]): void {
    this.push("error", args);
  }

  /** Subscribe to new log entries. Returns an unsubscribe function. */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /** Returns the current snapshot of all log entries. */
  getSnapshot(): LogEntry[] {
    return this.entries;
  }

  private push(level: LogLevel, args: unknown[]): void {
    this.entries = [...this.entries, { id: this.nextId++, level, timestamp: timestamp(), args }];
    for (const listener of this.listeners) {
      listener();
    }
  }
}

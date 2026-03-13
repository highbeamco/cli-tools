import { appendFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

import type { Logger } from "./Logger";

export class FileLogger implements Logger {
  private readonly filePath: string;

  constructor(logDir: string) {
    mkdirSync(logDir, { recursive: true });

    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, "-");
    this.filePath = resolve(logDir, `${timestamp}.log`);
  }

  info(...args: unknown[]): void {
    this.write("INFO", args);
  }

  warn(...args: unknown[]): void {
    this.write("WARN", args);
  }

  error(...args: unknown[]): void {
    this.write("ERROR", args);
  }

  private write(level: string, args: unknown[]): void {
    const timestamp = new Date().toISOString();
    const message = args.map((a) => (typeof a === "string" ? a : JSON.stringify(a))).join(" ");
    appendFileSync(this.filePath, `${timestamp} [${level}] ${message}\n`);
  }
}

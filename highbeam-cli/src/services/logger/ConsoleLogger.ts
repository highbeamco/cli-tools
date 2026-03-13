import type { Logger } from "./Logger";

// ANSI color codes
const RESET = "\x1b[0m";
const DIM = "\x1b[2m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const CYAN = "\x1b[36m";
const BOLD_RED = "\x1b[1;31m";
const BOLD_YELLOW = "\x1b[1;33m";

type Level = "info" | "warn" | "error";

const LEVEL_COLORS: Record<Level, { label: string; message: string }> = {
  info: { label: "", message: "" },
  warn: { label: BOLD_YELLOW, message: YELLOW },
  error: { label: BOLD_RED, message: RED },
};

/**
 * Extract a `[domain]` prefix from the first argument (if it's a string)
 * and colorize it in cyan.  Returns the reformatted first arg.
 */
function formatFirstArg(arg: unknown, level: Level): unknown {
  if (typeof arg !== "string") return arg;

  const match = arg.match(/^(\[[^\]]+\])\s*(.*)/);
  if (!match) {
    const msgColor = LEVEL_COLORS[level].message;
    return msgColor ? `${msgColor}${arg}${RESET}` : arg;
  }

  const domain = match[1];
  const rest = match[2];
  const msgColor = LEVEL_COLORS[level].message;
  const coloredRest = msgColor ? `${msgColor}${rest}${RESET}` : rest;
  return `${CYAN}${domain}${RESET} ${coloredRest}`;
}

function timestamp(): string {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  const s = String(now.getSeconds()).padStart(2, "0");
  const ms = String(now.getMilliseconds()).padStart(3, "0");
  return `${DIM}${h}:${m}:${s}.${ms}${RESET}`;
}

export class ConsoleLogger implements Logger {
  info(...args: unknown[]): void {
    const [first, ...rest] = args;
    console.error(timestamp(), formatFirstArg(first, "info"), ...rest);
  }

  warn(...args: unknown[]): void {
    const [first, ...rest] = args;
    const label = `${BOLD_YELLOW}WARN${RESET}`;
    console.warn(timestamp(), label, formatFirstArg(first, "warn"), ...rest);
  }

  error(...args: unknown[]): void {
    const [first, ...rest] = args;
    const label = `${BOLD_RED}ERROR${RESET}`;
    console.error(timestamp(), label, formatFirstArg(first, "error"), ...rest);
  }
}

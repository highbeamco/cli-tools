import { ConsoleLogger } from "./ConsoleLogger";
import type { Logger } from "./Logger";

const noopLogger: Logger = {
  info() {},
  warn() {},
  error() {},
};

let logger: Logger = noopLogger;

export function setLogger(newLogger: Logger): void {
  logger = newLogger;
}

export function enableVerboseLogging(): void {
  logger = new ConsoleLogger();
}

export { logger, type Logger };

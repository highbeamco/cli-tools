import { homedir } from "node:os";
import { resolve } from "node:path";

function loadString(envVarName: string): string {
  const value = process.env[envVarName];
  if (!value) {
    throw new Error(`Missing env variable: ${envVarName}`);
  }
  return value;
}

function loadOptionalString(envVarName: string, fallback: string | (() => string)): string {
  const value = process.env[envVarName];
  if (value !== undefined) return value;
  return typeof fallback === "function" ? fallback() : fallback;
}

function loadOptionalInt(envVarName: string, fallback: number): number {
  const raw = process.env[envVarName];
  if (!raw) return fallback;
  const parsed = parseInt(raw, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function loadOptionalBool(envVarName: string, fallback: boolean): boolean {
  const raw = process.env[envVarName];
  if (raw === undefined) return fallback;
  return raw !== "false";
}

export class Env {
  // -- Backend APIs ---------------------------------------------------------

  get HIGHBEAM_API_ORIGIN_AI(): string {
    return loadString("HIGHBEAM_API_ORIGIN_AI");
  }
  get HIGHBEAM_API_ORIGIN_V1(): string {
    return loadString("HIGHBEAM_API_ORIGIN_V1");
  }
  get HIGHBEAM_API_ORIGIN_V2(): string {
    return loadString("HIGHBEAM_API_ORIGIN_V2");
  }

  // -- Auth -----------------------------------------------------------------

  get HIGHBEAM_AUTH_ORIGIN(): string {
    return loadString("HIGHBEAM_AUTH_ORIGIN");
  }
  get AUTH0_CLIENT_ID(): string {
    return loadString("AUTH0_CLIENT_ID");
  }
  get AUTH0_TENANT_DOMAIN(): string {
    return loadString("AUTH0_TENANT_DOMAIN");
  }

  // -- Server ---------------------------------------------------------------

  get MCP_HOST(): string {
    return loadOptionalString("MCP_HOST", "127.0.0.1");
  }
  get MCP_PORT(): number {
    return loadOptionalInt("MCP_PORT", 59443);
  }
  get MCP_BROADCAST(): boolean {
    return loadOptionalBool("MCP_BROADCAST", true);
  }
  get MCP_ORIGIN(): string {
    return loadOptionalString("MCP_ORIGIN", `http://${this.MCP_HOST}:${this.MCP_PORT}`);
  }
  get MCP_SERVICE_NAME(): string {
    return loadOptionalString("MCP_SERVICE_NAME", "Highbeam MCP");
  }

  // -- Claude -----------------------------------------------------------------

  get CLAUDE_CONFIG_PATH(): string {
    return loadOptionalString("CLAUDE_CONFIG_PATH", () =>
      resolve(homedir(), "Library", "Application Support", "Claude", "claude_desktop_config.json"),
    );
  }

  // -- Google -----------------------------------------------------------------

  get GOOGLE_CLIENT_ID(): string {
    return loadString("GOOGLE_CLIENT_ID");
  }
  get GOOGLE_CLIENT_SECRET(): string {
    return loadString("GOOGLE_CLIENT_SECRET");
  }
  get GOOGLE_SCOPES(): string | undefined {
    return process.env["GOOGLE_SCOPES"];
  }

  // -- Storage ----------------------------------------------------------------

  get HIGHBEAM_STORAGE_PATH(): string {
    return loadOptionalString("HIGHBEAM_STORAGE_PATH", () => resolve(homedir(), ".highbeam"));
  }

  // -- API Keys ---------------------------------------------------------------

  get OPENAI_API_KEY(): string | undefined {
    return process.env["OPENAI_API_KEY"];
  }
  get ANTHROPIC_API_KEY(): string | undefined {
    return process.env["ANTHROPIC_API_KEY"];
  }
}

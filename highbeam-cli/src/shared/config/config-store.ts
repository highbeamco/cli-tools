import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { Env } from "shared/env/env";
import type { BusinessRep } from "../../features/businesses/reps/BusinessRep";

export type StoredBusiness = BusinessRep & {
  default: boolean;
};

interface Config {
  businesses: StoredBusiness[];
}

function getConfigPath(): string {
  const env = new Env();
  return resolve(env.HIGHBEAM_STORAGE_PATH, "config.json");
}

export function readConfig(): Config {
  const configPath = getConfigPath();

  if (!existsSync(configPath)) {
    return { businesses: [] };
  }

  try {
    const raw = JSON.parse(readFileSync(configPath, "utf-8"));
    return { businesses: Array.isArray(raw.businesses) ? raw.businesses : [] };
  } catch {
    return { businesses: [] };
  }
}

export function writeConfig(config: Config): void {
  const env = new Env();
  mkdirSync(env.HIGHBEAM_STORAGE_PATH, { recursive: true });
  writeFileSync(getConfigPath(), JSON.stringify(config, null, 2));
}

export function getBusinessGuid(businessName?: string): string {
  const config = readConfig();

  if (config.businesses.length === 0) {
    throw new Error("No businesses configured. Please run `highbeam business add` first.");
  }

  let business: StoredBusiness | undefined;

  if (businessName) {
    business = config.businesses.find((b) => {
      const name = b.name ?? b.dba;
      return name && toBusinessKey(name) === toBusinessKey(businessName);
    });
    if (!business) {
      business = config.businesses.find((b) => b.guid === businessName);
    }
    if (!business) {
      throw new Error(
        `Business "${businessName}" not found. Run \`highbeam business list\` to see available businesses.`,
      );
    }
  } else {
    business = config.businesses.find((b) => b.default);
    if (!business) {
      throw new Error(
        "No default business configured. Please run `highbeam business add --default` or pass --business.",
      );
    }
  }

  return business.guid;
}

export function toBusinessKey(businessName: string): string {
  return businessName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "_");
}

import { search } from "@inquirer/prompts";
import Fuse from "fuse.js";

import { Env } from "shared/env/env";
import { AuthTokenStore } from "services/auth/auth-token-store";
import { ServerTokenAuthService } from "services/auth/server-token-auth-service";
import { readConfig, writeConfig, toBusinessKey, type StoredBusiness } from "shared/config/config-store";
import type { BusinessRep } from "../features/businesses/reps/BusinessRep";
import { toBusinessData } from "../features/dataschema/reps/BusinessRep";

export async function businessAddAction(opts: { default?: boolean }) {
  const env = new Env();
  const tokenStore = new AuthTokenStore(env.HIGHBEAM_STORAGE_PATH);
  const authService = new ServerTokenAuthService(env, tokenStore);

  if (!(await authService.tryLoadOrRefresh())) {
    console.log("Not authenticated. Please run `highbeam login` first.");
    authService.dispose();
    return;
  }

  const { BackendApisProvider } = await import("services/api/backend-apis-provider");
  const { queryBusinesses } = await import("../features/businesses/queries/queryBusinesses");

  const apisProvider = new BackendApisProvider(env);
  const apis = apisProvider.createForToken(() => authService.getAccessToken(undefined)!);

  console.log("Fetching businesses...");
  const businesses = await queryBusinesses(apis.v1);

  if (businesses.length === 0) {
    console.log("No businesses found for your account.");
    authService.dispose();
    return;
  }

  const fuse = new Fuse(businesses, {
    keys: ["name", "dba", "guid"],
    threshold: 0.4,
  });

  const formatBusiness = (b: BusinessRep) => {
    const label = b.name ?? b.dba ?? "Unnamed";
    return `${label} (${b.guid})`;
  };

  const selectedBusiness = await search({
    message: "Search for a business:",
    source: (input) => {
      if (!input) {
        return businesses.map((b) => ({
          name: formatBusiness(b),
          value: b,
        }));
      }
      return fuse
        .search(input)
        .slice(0, 5)
        .map((r) => ({
          name: formatBusiness(r.item),
          value: r.item,
        }));
    },
  });

  const config = readConfig();
  const businessKey = toBusinessKey(selectedBusiness.name ?? selectedBusiness.dba ?? selectedBusiness.guid);

  const existing = config.businesses.find((b) => {
    const name = b.name ?? b.dba;
    return name && toBusinessKey(name) === businessKey;
  });

  const isFirst = config.businesses.length === 0;
  const shouldBeDefault = opts.default ?? isFirst;

  if (shouldBeDefault) {
    for (const b of config.businesses) {
      b.default = false;
    }
  }

  if (existing) {
    Object.assign(existing, selectedBusiness, { default: shouldBeDefault || existing.default });
    console.log(`Updated existing business "${selectedBusiness.name ?? selectedBusiness.dba}".`);
  } else {
    const stored: StoredBusiness = {
      ...selectedBusiness,
      default: shouldBeDefault,
    };
    config.businesses.push(stored);
    console.log(
      `Added business "${selectedBusiness.name ?? selectedBusiness.dba}"${shouldBeDefault ? " (default)" : ""}.`,
    );
  }

  writeConfig(config);
  authService.dispose();
}

export async function businessListAction(opts: { added?: boolean }) {
  if (opts.added) {
    const config = readConfig();
    console.log(JSON.stringify(config.businesses, null, 2));
    return;
  }

  const env = new Env();
  const tokenStore = new AuthTokenStore(env.HIGHBEAM_STORAGE_PATH);
  const authService = new ServerTokenAuthService(env, tokenStore);

  if (!(await authService.tryLoadOrRefresh())) {
    console.log("Not authenticated. Please run `highbeam login` first.");
    authService.dispose();
    return;
  }

  const { BackendApisProvider } = await import("services/api/backend-apis-provider");
  const { queryBusinesses } = await import("../features/businesses/queries/queryBusinesses");

  const apisProvider = new BackendApisProvider(env);
  const apis = apisProvider.createForToken(() => authService.getAccessToken(undefined)!);

  const businesses = await queryBusinesses(apis.v1);
  const result = businesses.map(toBusinessData);
  console.log(JSON.stringify(result, null, 2));

  authService.dispose();
}

export function businessSetNameAction(opts: { business?: string; name: string }) {
  const config = readConfig();

  let target: StoredBusiness | undefined;

  if (opts.business) {
    target = config.businesses.find((b) => {
      const name = b.name ?? b.dba;
      return name && toBusinessKey(name) === toBusinessKey(opts.business!);
    });
    if (!target) {
      console.error(`Business "${opts.business}" not found.`);
      process.exit(1);
    }
  } else {
    target = config.businesses.find((b) => b.default);
    if (!target) {
      console.error("No default business found. Use --business to specify one.");
      process.exit(1);
    }
  }

  const oldName = target.name;
  target.name = opts.name;
  writeConfig(config);
  console.log(`Renamed business "${oldName}" to "${opts.name}".`);
}

export function businessSetDefaultAction(opts: { business: string }) {
  const config = readConfig();

  const target = config.businesses.find((b) => {
    const name = b.name ?? b.dba;
    return name && toBusinessKey(name) === toBusinessKey(opts.business);
  });
  if (!target) {
    console.error(`Business "${opts.business}" not found.`);
    process.exit(1);
  }

  for (const b of config.businesses) {
    b.default = false;
  }
  target.default = true;

  writeConfig(config);
  console.log(`Default business set to "${target.name ?? target.dba}".`);
}

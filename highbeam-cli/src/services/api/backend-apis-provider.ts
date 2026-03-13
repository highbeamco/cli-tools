import ky, { type AfterResponseHook, type BeforeRequestHook } from "ky";
import type { AgenticBackendApis } from "../../shared/context/backend-apis";
import { Env } from "../../shared/env/env";
import { logger } from "../logger";

export type TokenSource = string | (() => string);

export class BackendApisProvider {
  constructor(private readonly env: Env) {}

  createForToken(tokenSource: TokenSource): AgenticBackendApis {
    const getToken = typeof tokenSource === "function" ? tokenSource : () => tokenSource;

    logger.info(
      `[backend-api] Creating API clients (${typeof tokenSource === "function" ? "dynamic" : "static"} token source)`,
    );

    const addAuthHeader: BeforeRequestHook = async (request) => {
      const token = getToken();
      request.headers.set("Authorization", `Bearer ${token}`);
    };

    const logResponse: AfterResponseHook = async (request, _options, response) => {
      if (!response.ok) {
        const body = await response
          .clone()
          .text()
          .catch(() => "(unreadable)");
        logger.warn(`[backend-api] ${request.method} ${request.url} → ${response.status}: ${body}`);
      }
    };

    const defaults = {
      timeout: 60_000,
      hooks: {
        beforeRequest: [addAuthHeader],
        afterResponse: [logResponse],
      },
    };

    return {
      v1: {
        type: "v1",
        ky: ky.extend({
          prefixUrl: this.env.HIGHBEAM_API_ORIGIN_V1,
          ...defaults,
        }),
      },
      v2: {
        type: "v2",
        ky: ky.extend({
          prefixUrl: this.env.HIGHBEAM_API_ORIGIN_V2,
          ...defaults,
        }),
      },
      ai: {
        type: "ai",
        ky: ky.extend({
          prefixUrl: this.env.HIGHBEAM_API_ORIGIN_AI,
          ...defaults,
        }),
      },
    };
  }
}

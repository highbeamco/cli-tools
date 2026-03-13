import { HTTPError } from "ky";
import { z } from "zod/v4";

import type { BackendApi } from "./BackendApi.js";

export type Query<Api extends BackendApi, Params, Result> = {
  name: string;
  path: (params: Params) => string;
  searchParams?: (params: Params) => Record<string, string>;
  responseSchema: z.ZodType<Result>;
};

export type PostQuery<Api extends BackendApi, Params, Result> = {
  name: string;
  path: (params: Params) => string;
  body: (params: Params) => unknown;
  responseSchema: z.ZodType<Result>;
};

export const query = async <Api extends BackendApi, Params, Result>(
  api: Api,
  definition: Query<Api, Params, Result>,
  params: Params,
): Promise<Result> => {
  try {
    const body = await api.ky
      .get(definition.path(params), {
        searchParams: definition.searchParams?.(params),
      })
      .json<unknown>();

    return definition.responseSchema.parse(body);
  } catch (error) {
    if (error instanceof HTTPError) {
      const body = await error.response.text().catch(() => "(could not read body)");
      throw new Error(
        `${definition.name} failed (${error.response.status}): ${body.slice(0, 500)}`,
      );
    }

    if (error instanceof z.ZodError) {
      throw new Error(`${definition.name} returned an invalid response: ${error.message}`);
    }

    throw error instanceof Error ? error : new Error(String(error));
  }
};

export const postQuery = async <Api extends BackendApi, Params, Result>(
  api: Api,
  definition: PostQuery<Api, Params, Result>,
  params: Params,
): Promise<Result> => {
  try {
    const body = await api.ky
      .post(definition.path(params), {
        json: definition.body(params),
      })
      .json<unknown>();

    return definition.responseSchema.parse(body);
  } catch (error) {
    if (error instanceof HTTPError) {
      const body = await error.response.text().catch(() => "(could not read body)");
      throw new Error(
        `${definition.name} failed (${error.response.status}): ${body.slice(0, 500)}`,
      );
    }

    if (error instanceof z.ZodError) {
      throw new Error(`${definition.name} returned an invalid response: ${error.message}`);
    }

    throw error instanceof Error ? error : new Error(String(error));
  }
};

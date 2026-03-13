import { HTTPError } from "ky";
import { z } from "zod/v4";

import type { BackendApi } from "./BackendApi.js";

export type Mutation<Api extends BackendApi, Params, Result> = {
  name: string;
  method: "put" | "post" | "patch" | "delete";
  path: (params: Params) => string;
  body?: (params: Params) => unknown;
  responseSchema: z.ZodType<Result>;
};

export const mutate = async <Api extends BackendApi, Params, Result>(
  api: Api,
  definition: Mutation<Api, Params, Result>,
  params: Params,
): Promise<Result> => {
  try {
    const body = await api.ky[definition.method](definition.path(params), {
      ...(definition.body ? { json: definition.body(params) } : {}),
    }).json<unknown>();

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

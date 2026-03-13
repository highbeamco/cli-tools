import { z } from "zod/v4";

import type { BackendApiV1 } from "../../../shared/api/BackendApi";
import { query, type Query } from "../../../shared/api/query";
import { BusinessRepSchema } from "../reps/BusinessRep";

export type QueryBusinessesParams = Record<string, never>;

export const QueryBusinessesResultSchema = z.array(BusinessRepSchema);
export type QueryBusinessesResult = z.infer<typeof QueryBusinessesResultSchema>;

const QueryBusinessesQuery: Query<BackendApiV1, QueryBusinessesParams, QueryBusinessesResult> = {
  name: "queryBusinesses",
  path: () => "businesses",
  responseSchema: QueryBusinessesResultSchema,
};

export const queryBusinesses = async (api: BackendApiV1): Promise<QueryBusinessesResult> => {
  return query(api, QueryBusinessesQuery, {});
};

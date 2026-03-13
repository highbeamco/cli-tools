import { z } from "zod/v4";

import type { BackendApiV1 } from "../../../shared/api/BackendApi.js";
import { query, type Query } from "../../../shared/api/query.js";
import { BusinessRepSchema } from "../reps/BusinessRep.js";

export type QueryBusinessParams = {
  businessGuid: string;
};

export const QueryBusinessResultSchema = BusinessRepSchema;
export type QueryBusinessResult = z.infer<typeof QueryBusinessResultSchema>;

const QueryBusinessQuery: Query<BackendApiV1, QueryBusinessParams, QueryBusinessResult> = {
  name: "queryBusiness",
  path: ({ businessGuid }) => `businesses/${businessGuid}`,
  responseSchema: QueryBusinessResultSchema,
};

export const queryBusiness = async (
  api: BackendApiV1,
  params: QueryBusinessParams,
): Promise<QueryBusinessResult> => {
  return query(api, QueryBusinessQuery, params);
};

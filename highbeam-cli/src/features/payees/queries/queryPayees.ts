import { z } from "zod/v4";

import type { BackendApiV1 } from "../../../shared/api/BackendApi.js";
import { query, type Query } from "../../../shared/api/query.js";
import { PayeeRepSchema } from "../reps/PayeeRep.js";

export type QueryPayeesParams = {
  businessGuid: string;
};

export const QueryPayeesResultSchema = z.array(PayeeRepSchema);
export type QueryPayeesResult = z.infer<typeof QueryPayeesResultSchema>;

const QueryPayeesQuery: Query<BackendApiV1, QueryPayeesParams, QueryPayeesResult> = {
  name: "queryPayees",
  path: ({ businessGuid }) => `businesses/${businessGuid}/payees`,
  responseSchema: QueryPayeesResultSchema,
};

export const queryPayees = async (
  api: BackendApiV1,
  params: QueryPayeesParams,
): Promise<QueryPayeesResult> => {
  return query(api, QueryPayeesQuery, params);
};

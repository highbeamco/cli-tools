import { z } from "zod/v4";

import type { BackendApiV1 } from "../../../shared/api/BackendApi.js";
import { query, type Query } from "../../../shared/api/query.js";
import { CapitalAccountRepSchema } from "../reps/CapitalAccountRep.js";

export type QueryCapitalAccountsParams = {
  businessGuid: string;
};

export const QueryCapitalAccountsResultSchema = z.array(CapitalAccountRepSchema);
export type QueryCapitalAccountsResult = z.infer<typeof QueryCapitalAccountsResultSchema>;

const QueryCapitalAccountsQuery: Query<
  BackendApiV1,
  QueryCapitalAccountsParams,
  QueryCapitalAccountsResult
> = {
  name: "queryCapitalAccounts",
  path: () => `capital-accounts`,
  searchParams: ({ businessGuid }) => ({ businessGuid }),
  responseSchema: QueryCapitalAccountsResultSchema,
};

export const queryCapitalAccounts = async (
  api: BackendApiV1,
  params: QueryCapitalAccountsParams,
): Promise<QueryCapitalAccountsResult> => {
  return query(api, QueryCapitalAccountsQuery, params);
};

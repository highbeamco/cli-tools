import { z } from "zod/v4";

import type { BackendApiV1 } from "../../../shared/api/BackendApi.js";
import { query, type Query } from "../../../shared/api/query.js";
import { CreditApplicationRepSchema } from "../reps/CreditApplicationRep.js";

export type QueryCreditApplicationsParams = {
  businessGuid: string;
};

export const QueryCreditApplicationsResultSchema = z.array(CreditApplicationRepSchema);
export type QueryCreditApplicationsResult = z.infer<typeof QueryCreditApplicationsResultSchema>;

const QueryCreditApplicationsQuery: Query<
  BackendApiV1,
  QueryCreditApplicationsParams,
  QueryCreditApplicationsResult
> = {
  name: "queryCreditApplications",
  path: ({ businessGuid }) => `businesses/${businessGuid}/credit-applications`,
  responseSchema: QueryCreditApplicationsResultSchema,
};

export const queryCreditApplications = async (
  api: BackendApiV1,
  params: QueryCreditApplicationsParams,
): Promise<QueryCreditApplicationsResult> => {
  return query(api, QueryCreditApplicationsQuery, params);
};

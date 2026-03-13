import { z } from "zod/v4";

import type { BackendApiV2 } from "../../../shared/api/BackendApi.js";
import { query, type Query } from "../../../shared/api/query.js";
import { BillRepSchema } from "../reps/BillRep.js";

export type QueryBillsParams = {
  businessGuid: string;
};

export const QueryBillsResultSchema = z.array(BillRepSchema);
export type QueryBillsResult = z.infer<typeof QueryBillsResultSchema>;

const QueryBillsQuery: Query<BackendApiV2, QueryBillsParams, QueryBillsResult> = {
  name: "queryBills",
  path: () => `accounts-payable/bills`,
  searchParams: ({ businessGuid }) => ({ businessGuid }),
  responseSchema: QueryBillsResultSchema,
};

export const queryBills = async (
  api: BackendApiV2,
  params: QueryBillsParams,
): Promise<QueryBillsResult> => {
  return query(api, QueryBillsQuery, params);
};

import { z } from "zod/v4";

import type { BackendApiV2 } from "../../../shared/api/BackendApi.js";
import { query, type Query } from "../../../shared/api/query.js";
import { PaymentRepSchema } from "../reps/PaymentRep.js";

export type QueryPaymentsParams = {
  businessGuid: string;
};

export const QueryPaymentsResultSchema = z.array(PaymentRepSchema);
export type QueryPaymentsResult = z.infer<typeof QueryPaymentsResultSchema>;

const QueryPaymentsQuery: Query<BackendApiV2, QueryPaymentsParams, QueryPaymentsResult> = {
  name: "queryPayments",
  path: () => `payments-core/payments`,
  searchParams: ({ businessGuid }) => ({ businessGuid }),
  responseSchema: QueryPaymentsResultSchema,
};

export const queryPayments = async (
  api: BackendApiV2,
  params: QueryPaymentsParams,
): Promise<QueryPaymentsResult> => {
  return query(api, QueryPaymentsQuery, params);
};

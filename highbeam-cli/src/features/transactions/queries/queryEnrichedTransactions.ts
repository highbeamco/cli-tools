import { z } from "zod/v4";

import type { BackendApiV2 } from "../../../shared/api/BackendApi.js";
import { query, type Query } from "../../../shared/api/query.js";
import { EnrichedTransactionRepSchema } from "../reps/EnrichedTransactionRep.js";

export type QueryEnrichedTransactionsParams = {
  businessGuid: string;
  limit: number;
  offset: number;
};

const PaginatedEnrichedTransactionsSchema = z.object({
  pageInfo: z.object({
    page: z.number(),
    pageSize: z.number(),
    totalPages: z.number(),
    totalCount: z.number(),
  }),
  results: z.array(EnrichedTransactionRepSchema),
});

export const QueryEnrichedTransactionsResultSchema = z.array(EnrichedTransactionRepSchema);
export type QueryEnrichedTransactionsResult = z.infer<typeof QueryEnrichedTransactionsResultSchema>;

const QueryEnrichedTransactionsQuery: Query<
  BackendApiV2,
  QueryEnrichedTransactionsParams,
  QueryEnrichedTransactionsResult
> = {
  name: "queryEnrichedTransactions",
  path: ({ businessGuid }) => `insights/enriched-transactions/${businessGuid}`,
  searchParams: ({ limit, offset }) => ({
    page: String(Math.floor(offset / limit) + 1),
    pageSize: String(limit),
  }),
  responseSchema: PaginatedEnrichedTransactionsSchema.transform((res) => res.results),
};

export const queryEnrichedTransactions = async (
  api: BackendApiV2,
  params: QueryEnrichedTransactionsParams,
): Promise<QueryEnrichedTransactionsResult> => {
  return query(api, QueryEnrichedTransactionsQuery, params);
};

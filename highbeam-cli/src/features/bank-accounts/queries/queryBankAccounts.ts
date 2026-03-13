import { z } from "zod/v4";

import type { BackendApiV1 } from "../../../shared/api/BackendApi.js";
import { query, type Query } from "../../../shared/api/query.js";
import { BankAccountRepSchema } from "../reps/BankAccountRep.js";

export type QueryBankAccountsParams = {
  businessGuid: string;
};

export const QueryBankAccountsResultSchema = z.array(BankAccountRepSchema);
export type QueryBankAccountsResult = z.infer<typeof QueryBankAccountsResultSchema>;

const QueryBankAccountsQuery: Query<
  BackendApiV1,
  QueryBankAccountsParams,
  QueryBankAccountsResult
> = {
  name: "queryBankAccounts",
  path: () => `bank-accounts`,
  searchParams: ({ businessGuid }) => ({ businessGuid }),
  responseSchema: QueryBankAccountsResultSchema,
};

export const queryBankAccounts = async (
  api: BackendApiV1,
  params: QueryBankAccountsParams,
): Promise<QueryBankAccountsResult> => {
  return query(api, QueryBankAccountsQuery, params);
};

import { z } from "zod/v4";

import type { BackendApiV2 } from "../../../shared/api/BackendApi.js";
import { mutate, type Mutation } from "../../../shared/api/mutation.js";
import { InsightsCategorySchema, type InsightsCategory } from "../reps/InsightsCategoryRep.js";

export type SetTransactionCategoryParams = {
  businessGuid: string;
  counterparty: string;
  category: InsightsCategory;
};

export const SetTransactionCategoryResultSchema = z.object({
  id: z.string(),
  businessGuid: z.string(),
  counterparty: z.string(),
  category: InsightsCategorySchema,
  source: z.enum(["HighbeamAdmin", "User", "Ai"]),
  reviewed: z.boolean(),
});

export type SetTransactionCategoryResult = z.infer<typeof SetTransactionCategoryResultSchema>;

const SetTransactionCategoryMutation: Mutation<
  BackendApiV2,
  SetTransactionCategoryParams,
  SetTransactionCategoryResult
> = {
  name: "setTransactionCategory",
  method: "put",
  path: () => `insights/transaction-categorizers/set`,
  body: ({ businessGuid, counterparty, category }) => ({
    businessGuid,
    counterparty,
    category,
    source: "User",
    reviewed: false,
  }),
  responseSchema: SetTransactionCategoryResultSchema,
};

export const setTransactionCategory = async (
  api: BackendApiV2,
  params: SetTransactionCategoryParams,
): Promise<SetTransactionCategoryResult> => {
  return mutate(api, SetTransactionCategoryMutation, params);
};

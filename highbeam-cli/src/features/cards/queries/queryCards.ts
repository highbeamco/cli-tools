import { z } from "zod/v4";

import type { BackendApiV1 } from "../../../shared/api/BackendApi.js";
import { query, type Query } from "../../../shared/api/query.js";

export type QueryCardsParams = {
  businessGuid: string;
};

const UnitCardSchema = z
  .object({
    id: z.string(),
    type: z.string(),
    attributes: z
      .object({
        tags: z
          .object({
            name: z.string().optional(),
            businessGuid: z.string().optional(),
            bankAccountGuid: z.string().optional(),
            creditAccountGuid: z.string().optional(),
          })
          .passthrough()
          .optional(),
        limits: z
          .object({
            dailyPurchase: z.object({ amount: z.coerce.number() }).optional(),
            monthlyPurchase: z.object({ amount: z.coerce.number() }).optional(),
          })
          .passthrough()
          .optional(),
      })
      .passthrough(),
  })
  .passthrough();

const UnitCoCardsResponseSchema = z.object({
  unitResponse: z.array(UnitCardSchema),
});

export type UnitCard = z.infer<typeof UnitCardSchema>;

export const QueryCardsResultSchema = z.array(UnitCardSchema);
export type QueryCardsResult = z.infer<typeof QueryCardsResultSchema>;

const QueryCardsQuery: Query<BackendApiV1, QueryCardsParams, QueryCardsResult> = {
  name: "queryCards",
  path: () => `charge-cards/search`,
  searchParams: ({ businessGuid }) => ({ businessGuid }),
  responseSchema: UnitCoCardsResponseSchema.transform((res) => res.unitResponse),
};

export const queryCards = async (
  api: BackendApiV1,
  params: QueryCardsParams,
): Promise<QueryCardsResult> => {
  return query(api, QueryCardsQuery, params);
};

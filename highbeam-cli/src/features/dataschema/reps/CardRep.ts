import { z } from "zod/v4";

import type { UnitCard } from "../../cards/queries/queryCards";

export const CardDataSchema = z.object({
  cardId: z.string(),
  type: z.string(),
  name: z.string().nullable(),
  businessGuid: z.string().nullable(),
  accountGuid: z.string().nullable(),
  dailyPurchaseLimit: z.number().nullable(),
  monthlyPurchaseLimit: z.number().nullable(),
});

export type CardData = z.infer<typeof CardDataSchema>;

export function toCardData(c: UnitCard): CardData {
  return {
    cardId: c.id,
    type: c.type,
    name: c.attributes.tags?.name ?? null,
    businessGuid: c.attributes.tags?.businessGuid ?? null,
    accountGuid: c.attributes.tags?.bankAccountGuid ?? null,
    dailyPurchaseLimit: c.attributes.limits?.dailyPurchase?.amount ?? null,
    monthlyPurchaseLimit: c.attributes.limits?.monthlyPurchase?.amount ?? null,
  };
}

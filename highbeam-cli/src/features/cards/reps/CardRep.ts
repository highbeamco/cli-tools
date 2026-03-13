import { z } from "zod/v4";

export const CardRepSchema = z.object({
  cardId: z.string(),
  businessGuid: z.uuid(),
  accountGuid: z.uuid(),
  type: z.string(),
  name: z.string(),
  dailyPurchaseLimit: z.number().nullable(),
  monthlyPurchaseLimit: z.number().nullable(),
});

export type CardRep = z.infer<typeof CardRepSchema>;

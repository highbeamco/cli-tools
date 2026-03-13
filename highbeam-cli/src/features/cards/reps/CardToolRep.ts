import { z } from "zod/v4";

export const CardToolRepSchema = z.object({
  cardId: z.string(),
  businessGuid: z.string(),
  accountGuid: z.string(),
  type: z.string(),
  name: z.string(),
  dailyPurchaseLimit: z.number().nullable(),
  monthlyPurchaseLimit: z.number().nullable(),
});

export type CardToolRep = z.infer<typeof CardToolRepSchema>;

import { z } from "zod/v4";

export const CapitalAccountRepSchema = z.object({
  guid: z.uuid(),
  businessGuid: z.uuid(),
  name: z.string(),
  type: z.string(),
  state: z.string(),
  lender: z.string(),
  activatedAt: z.string().nullable(),
});

export type CapitalAccountRep = z.infer<typeof CapitalAccountRepSchema>;

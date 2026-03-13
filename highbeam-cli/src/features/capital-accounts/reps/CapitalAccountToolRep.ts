import { z } from "zod/v4";

export const CapitalAccountToolRepSchema = z.object({
  guid: z.uuid(),
  businessGuid: z.uuid(),
  name: z.string(),
  type: z.string(),
  state: z.string(),
  lender: z.string(),
  activatedAt: z.iso.datetime().nullable(),
});

export type CapitalAccountToolRep = z.infer<typeof CapitalAccountToolRepSchema>;

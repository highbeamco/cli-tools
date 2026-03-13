import { z } from "zod/v4";

export const CreditApplicationToolRepSchema = z.object({
  guid: z.uuid(),
  businessGuid: z.uuid(),
  state: z.string(),
  submittedAt: z.iso.datetime().nullable(),
  canReapplyAfter: z.iso.datetime().nullable(),
  offerInitialLimit: z.number().nullable(),
  offerNextLimit: z.number().nullable(),
  offerGoalLimit: z.number().nullable(),
  offerApr: z.number().nullable(),
  requestedAmount: z.number().nullable(),
  reasonForRequest: z.string().nullable(),
  industry: z.string().nullable(),
});

export type CreditApplicationToolRep = z.infer<typeof CreditApplicationToolRepSchema>;

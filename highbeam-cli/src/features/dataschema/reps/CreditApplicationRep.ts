import { z } from "zod/v4";

import type { CreditApplicationRep as ApiCreditApplicationRep } from "../../credit-applications/reps/CreditApplicationRep";

export const CreditApplicationDataSchema = z.object({
  guid: z.uuid(),
  state: z.string(),
  submittedAt: z.string().nullable(),
  canReapplyAfter: z.string().nullable(),
  offerInitialLimit: z.number().nullable(),
  offerNextLimit: z.number().nullable(),
  offerGoalLimit: z.number().nullable(),
  offerApr: z.number().nullable(),
  requestedAmount: z.number().nullable(),
  reasonForRequest: z.string().nullable(),
  industry: z.string().nullable(),
});

export type CreditApplicationData = z.infer<typeof CreditApplicationDataSchema>;

export function toCreditApplicationData(
  c: ApiCreditApplicationRep,
): CreditApplicationData {
  return {
    guid: c.guid,
    state: c.state,
    submittedAt: c.submittedAt,
    canReapplyAfter: c.canReapplyAfter,
    offerInitialLimit: c.offer?.initialLimit ?? null,
    offerNextLimit: c.offer?.nextLimit ?? null,
    offerGoalLimit: c.offer?.goalLimit ?? null,
    offerApr: c.offer?.apr ?? null,
    requestedAmount: c.userProvidedDetails?.requestedAmount ?? null,
    reasonForRequest: c.userProvidedDetails?.reasonForRequest ?? null,
    industry: c.userProvidedDetails?.industry ?? null,
  };
}

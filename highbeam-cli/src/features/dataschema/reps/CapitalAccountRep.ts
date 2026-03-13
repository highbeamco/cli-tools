import { z } from "zod/v4";

import type { CapitalAccountRep as ApiCapitalAccountRep } from "../../capital-accounts/reps/CapitalAccountRep";

export const CapitalAccountDataSchema = z.object({
  guid: z.uuid(),
  businessGuid: z.uuid(),
  name: z.string(),
  type: z.string(),
  state: z.string(),
  lender: z.string(),
  activatedAt: z.string().nullable(),
});

export type CapitalAccountData = z.infer<typeof CapitalAccountDataSchema>;

export function toCapitalAccountData(a: ApiCapitalAccountRep): CapitalAccountData {
  return {
    guid: a.guid,
    businessGuid: a.businessGuid,
    name: a.name,
    type: a.type,
    state: a.state,
    lender: a.lender,
    activatedAt: a.activatedAt,
  };
}

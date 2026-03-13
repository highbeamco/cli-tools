import { z } from "zod/v4";

import type { BankAccountRep as ApiBankAccountRep } from "../../bank-accounts/reps/BankAccountRep";

export const BankAccountDataSchema = z.object({
  guid: z.uuid(),
  businessGuid: z.uuid(),
  name: z.string(),
  status: z.string(),
  isPrimary: z.boolean(),
  availableBalance: z.number(),
  routingNumber: z.string(),
  accountNumber: z.string(),
  type: z.string(),
  highbeamTypeName: z.string(),
  depositProductName: z.string().nullable(),
  interestBps: z.number().nullable(),
  sameDayAch: z.boolean().nullable(),
});

export type BankAccountData = z.infer<typeof BankAccountDataSchema>;

export function toBankAccountData(a: ApiBankAccountRep): BankAccountData {
  return {
    guid: a.guid,
    businessGuid: a.businessGuid,
    name: a.name,
    status: a.status,
    isPrimary: a.isPrimary,
    availableBalance: a.availableBalance,
    routingNumber: a.routingNumber,
    accountNumber: a.accountNumber,
    type: a.type,
    highbeamTypeName: a.highbeamType.name,
    depositProductName: a.depositProduct?.name ?? null,
    interestBps: a.depositProduct?.interestBps ?? null,
    sameDayAch: a.depositProduct?.sameDayAch ?? null,
  };
}

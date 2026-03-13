import { z } from "zod/v4";

import type { PaymentRep as ApiPaymentRep } from "../../payments/reps/PaymentRep";

export const PaymentDataSchema = z.object({
  id: z.string(),
  businessGuid: z.uuid(),
  state: z.string(),
  amount: z.number(),
  currency: z.string(),
  fromAccountType: z.string(),
  fromAccountId: z.string().nullable(),
  toAccountType: z.string(),
  toAccountId: z.string().nullable(),
  description: z.string().nullable(),
  provider: z.string().nullable(),
});

export type PaymentData = z.infer<typeof PaymentDataSchema>;

function extractAccountId(account: ApiPaymentRep["fromAccount"]): string | null {
  switch (account.type) {
    case "Unit":
      return account.unitAccountId;
    case "Capital":
    case "Lender":
      return account.capitalAccountGuid;
    default:
      return null;
  }
}

export function toPaymentData(p: ApiPaymentRep): PaymentData {
  return {
    id: p.id,
    businessGuid: p.businessGuid,
    state: p.state,
    amount: p.amount.amount,
    currency: p.amount.currency,
    fromAccountType: p.fromAccount.type,
    fromAccountId: extractAccountId(p.fromAccount),
    toAccountType: p.toAccount.type,
    toAccountId: extractAccountId(p.toAccount),
    description: p.description,
    provider: p.provider,
  };
}

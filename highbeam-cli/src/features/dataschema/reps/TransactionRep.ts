import { z } from "zod/v4";

import type { EnrichedTransactionRep } from "../../transactions/reps/EnrichedTransactionRep";

export const TransactionDataSchema = z.object({
  id: z.string(),
  accountId: z.string(),
  accountInstitutionName: z.string(),
  accountSubtype: z.string(),
  accountType: z.string(),
  amountValue: z.string(),
  amountCurrency: z.string(),
  balanceValue: z.string(),
  balanceCurrency: z.string(),
  businessGuid: z.uuid(),
  categoryGroup: z.string(),
  category: z.string(),
  subcategory: z.string(),
  counterparty: z.string(),
  descriptor: z.string(),
  date: z.iso.date(),
  source: z.string(),
});

export type TransactionData = z.infer<typeof TransactionDataSchema>;

export function toTransactionData(t: EnrichedTransactionRep): TransactionData {
  return {
    id: t.normalizedTransactionId,
    accountId: t.normalizedAccountId,
    accountInstitutionName: t.accountInstitutionName,
    accountSubtype: t.accountSubtype,
    accountType: t.accountType,
    amountValue: t.amount.amount,
    amountCurrency: t.amount.currency,
    balanceValue: t.balance.amount,
    balanceCurrency: t.balance.currency,
    businessGuid: t.businessGuid,
    categoryGroup: t.category.groupDisplayName,
    category: t.category.categoryDisplayName,
    subcategory: t.category.subcategoryDisplayName,
    counterparty: t.counterparty,
    descriptor: t.canonicalizedDescriptor,
    date: t.date,
    source: t.source,
  };
}

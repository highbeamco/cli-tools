import { z } from "zod/v4";

export const TransactionRepSchema = z.object({
  accountId: z.string(),
  accountInstitutionName: z.string(),
  accountSubtype: z.string(),
  accountType: z.string(),
  amountValue: z.string(),
  amountCurrency: z.string(),
  balanceCurrency: z.string(),
  balanceValue: z.string(),
  businessGuid: z.uuid(),
  categoryGroup: z.string(),
  category: z.string(),
  counterparty: z.string(),
  descriptor: z.string(),
  date: z.iso.date(),
  id: z.string(),
  source: z.string().describe("the data source where transaction was fetched"),
});

export type TransactionRep = z.infer<typeof TransactionRepSchema>;

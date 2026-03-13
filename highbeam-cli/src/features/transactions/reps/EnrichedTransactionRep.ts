import { z } from "zod/v4";

import {
  InsightsCategoryCompleteSchema,
  type InsightsCategoryComplete,
} from "./InsightsCategoryRep.js";

export interface Money {
  readonly amount: string;
  readonly currency: string;
}

export const MoneySchema = z.object({
  amount: z.string(),
  currency: z.string(),
});

export type AccountSource = "Highbeam" | "Plaid" | "Unit" | "Quickbooks";
export const AccountSourceSchema = z.enum(["Highbeam", "Plaid", "Unit", "Quickbooks"]);

export type AccountType = "Credit" | "Deposit" | "Investment" | "Loan";
export const AccountTypeSchema = z.enum(["Credit", "Deposit", "Investment", "Loan"]);

export type EnrichmentSource = "Fallback" | "Highbeam" | "HighbeamPayee" | "Plaid" | "Ai";
export const EnrichmentSourceSchema = z.enum([
  "Fallback",
  "Highbeam",
  "HighbeamPayee",
  "Plaid",
  "Ai",
]);

export interface EnrichedTransactionRep {
  readonly accountInstitutionId: string | null;
  readonly accountInstitutionName: string;
  readonly accountMaskDigits: string | null;
  readonly accountSubtype: string;
  readonly accountType: AccountType;
  readonly amount: Money;
  readonly at: string | null;
  readonly balance: Money;
  readonly businessGuid: string;
  readonly canonicalizedDescriptor: string;
  readonly category: InsightsCategoryComplete;
  readonly counterparty: string;
  readonly date: string;
  readonly enrichmentSource: EnrichmentSource;
  readonly importance: number;
  readonly counterpartyLogoUrl: string | null;
  readonly normalizedAccountId: string;
  readonly normalizedTransactionId: string;
  readonly originalCounterparty: string;
  readonly rawDescriptor: string;
  readonly rawTransactionId: string;
  readonly source: AccountSource;
  readonly rawJson: object;
  readonly transactionSource: string;
}

export const EnrichedTransactionRepSchema = z.object({
  accountInstitutionId: z.string().nullable(),
  accountInstitutionName: z.string(),
  accountMaskDigits: z.string().nullable(),
  accountSubtype: z.string(),
  accountType: AccountTypeSchema,
  amount: MoneySchema,
  at: z.iso.datetime().nullable(),
  balance: MoneySchema,
  businessGuid: z.uuid(),
  canonicalizedDescriptor: z.string(),
  category: InsightsCategoryCompleteSchema,
  counterparty: z.string(),
  date: z.iso.date(),
  enrichmentSource: EnrichmentSourceSchema,
  importance: z.number(),
  counterpartyLogoUrl: z.string().nullable(),
  normalizedAccountId: z.string(),
  normalizedTransactionId: z.string(),
  originalCounterparty: z.string(),
  rawDescriptor: z.string(),
  rawTransactionId: z.string(),
  source: AccountSourceSchema,
  rawJson: z.object({}).passthrough(),
  transactionSource: z.string(),
});

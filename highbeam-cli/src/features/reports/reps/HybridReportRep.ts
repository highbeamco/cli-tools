import { z } from "zod/v4";

import { InsightsCategoryRepSchema, MoneySchema } from "./CashFlowReportRep";

/**
 * The source of a report row.
 * - type "DepositAccounts": aggregated across all deposit (bank) accounts.
 * - type "Card": a single card identified by `id`.
 */
export const HybridReportSourceSchema = z.object({
  type: z.string().describe('Source kind, e.g. "DepositAccounts" or "Card"'),
  id: z.string().optional().describe("Identifier for the source, e.g. a card guid"),
});

export const HybridReportPeriodSchema = z.object({
  start: z.string(),
  end: z.string(),
  interval: z.string(),
});

export const HybridReportRowSchema = z.object({
  counterparty: z.string(),
  category: InsightsCategoryRepSchema,
  source: HybridReportSourceSchema,
  values: z.array(MoneySchema),
  total: MoneySchema,
});

export const HybridReportRepSchema = z.object({
  businessGuid: z.uuid(),
  start: z.string(),
  end: z.string(),
  periods: z.array(HybridReportPeriodSchema),
  data: z.array(HybridReportRowSchema),
});

export type HybridReportRep = z.infer<typeof HybridReportRepSchema>;

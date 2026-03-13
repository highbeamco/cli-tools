import { z } from "zod/v4";

export const InsightsCategoryRepSchema = z.object({
  value: z.string(),
  categoryDisplayName: z.string(),
  subcategoryDisplayName: z.string(),
  groupTypeValue: z.string(),
  groupTypeDisplayName: z.string(),
  groupDirectionValue: z.string(),
  groupDirectionDisplayName: z.string().nullable(),
  groupDisplayName: z.string(),
});

export const MoneySchema = z.object({
  amount: z.string(),
  currency: z.string(),
});

export const CashFlowReportPeriodSchema = z.object({
  start: z.string(),
  end: z.string(),
  interval: z.string(),
});

export const CashFlowReportRowSchema = z.object({
  counterparty: z.string(),
  category: InsightsCategoryRepSchema,
  values: z.array(MoneySchema),
  total: MoneySchema,
});

export const CashFlowReportRepSchema = z.object({
  businessGuid: z.uuid(),
  start: z.string(),
  end: z.string(),
  periods: z.array(CashFlowReportPeriodSchema),
  data: z.array(CashFlowReportRowSchema),
});

export type CashFlowReportRep = z.infer<typeof CashFlowReportRepSchema>;

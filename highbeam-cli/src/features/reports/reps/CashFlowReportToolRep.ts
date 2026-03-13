import { z } from "zod/v4";

export const CashFlowReportPeriodToolRepSchema = z.object({
  start: z.string(),
  end: z.string(),
  interval: z.string(),
});

export const CashFlowReportRowToolRepSchema = z.object({
  counterparty: z.string(),
  categoryValue: z.string(),
  categoryDisplayName: z.string(),
  subcategoryDisplayName: z.string(),
  groupDisplayName: z.string(),
  groupDirectionValue: z.string(),
  values: z.array(z.object({ amount: z.string(), currency: z.string() })),
  totalAmount: z.string(),
  totalCurrency: z.string(),
});

export const CashFlowReportToolRepSchema = z.object({
  businessGuid: z.uuid(),
  start: z.string(),
  end: z.string(),
  periods: z.array(CashFlowReportPeriodToolRepSchema),
  data: z.array(CashFlowReportRowToolRepSchema),
});

export type CashFlowReportToolRep = z.infer<typeof CashFlowReportToolRepSchema>;

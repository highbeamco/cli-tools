import { z } from "zod/v4";

import type { CashFlowReportRep as ApiCashFlowReportRep } from "../../reports/reps/CashFlowReportRep";

const CashFlowReportPeriodDataSchema = z.object({
  start: z.string(),
  end: z.string(),
  interval: z.string(),
});

const CashFlowReportRowDataSchema = z.object({
  counterparty: z.string(),
  categoryValue: z.string(),
  categoryDisplayName: z.string(),
  subcategoryDisplayName: z.string(),
  groupDisplayName: z.string(),
  groupDirection: z.string(),
  values: z.array(z.object({ amount: z.string(), currency: z.string() })),
  totalAmount: z.string(),
  totalCurrency: z.string(),
});

export const CashFlowReportDataSchema = z.object({
  businessGuid: z.uuid(),
  start: z.string(),
  end: z.string(),
  periods: z.array(CashFlowReportPeriodDataSchema),
  data: z.array(CashFlowReportRowDataSchema),
});

export type CashFlowReportData = z.infer<typeof CashFlowReportDataSchema>;

export function toCashFlowReportData(r: ApiCashFlowReportRep): CashFlowReportData {
  return {
    businessGuid: r.businessGuid,
    start: r.start,
    end: r.end,
    periods: r.periods,
    data: r.data.map((row) => ({
      counterparty: row.counterparty,
      categoryValue: row.category.value,
      categoryDisplayName: row.category.categoryDisplayName,
      subcategoryDisplayName: row.category.subcategoryDisplayName,
      groupDisplayName: row.category.groupDisplayName,
      groupDirection: row.category.groupDirectionValue,
      values: row.values,
      totalAmount: row.total.amount,
      totalCurrency: row.total.currency,
    })),
  };
}

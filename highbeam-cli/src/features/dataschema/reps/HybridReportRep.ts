import { z } from "zod/v4";

import type { HybridReportRep as ApiHybridReportRep } from "../../reports/reps/HybridReportRep";

const HybridReportPeriodDataSchema = z.object({
  start: z.string(),
  end: z.string(),
  interval: z.string(),
});

const HybridReportRowDataSchema = z.object({
  counterparty: z.string(),
  categoryValue: z.string(),
  categoryDisplayName: z.string(),
  subcategoryDisplayName: z.string(),
  groupDisplayName: z.string(),
  groupDirection: z.string(),
  sourceType: z.string(),
  sourceId: z.string().nullable(),
  values: z.array(z.object({ amount: z.string(), currency: z.string() })),
  totalAmount: z.string(),
  totalCurrency: z.string(),
});

export const HybridReportDataSchema = z.object({
  businessGuid: z.uuid(),
  start: z.string(),
  end: z.string(),
  periods: z.array(HybridReportPeriodDataSchema),
  data: z.array(HybridReportRowDataSchema),
});

export type HybridReportData = z.infer<typeof HybridReportDataSchema>;

export function toHybridReportData(r: ApiHybridReportRep): HybridReportData {
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
      sourceType: row.source.type,
      sourceId: row.source.id ?? null,
      values: row.values,
      totalAmount: row.total.amount,
      totalCurrency: row.total.currency,
    })),
  };
}

import { z } from "zod/v4";

export const HybridReportSourceToolRepSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("DepositAccounts") }),
  z.object({ type: z.literal("Card"), id: z.string() }),
]);

export const HybridReportPeriodToolRepSchema = z.object({
  start: z.string(),
  end: z.string(),
  interval: z.string(),
});

export const HybridReportRowToolRepSchema = z.object({
  counterparty: z.string(),
  source: HybridReportSourceToolRepSchema,
  categoryValue: z.string(),
  categoryDisplayName: z.string(),
  subcategoryDisplayName: z.string(),
  groupDisplayName: z.string(),
  groupDirectionValue: z.string(),
  values: z.array(z.object({ amount: z.string(), currency: z.string() })),
  totalAmount: z.string(),
  totalCurrency: z.string(),
});

export const HybridReportToolRepSchema = z.object({
  businessGuid: z.uuid(),
  start: z.string(),
  end: z.string(),
  periods: z.array(HybridReportPeriodToolRepSchema),
  data: z.array(HybridReportRowToolRepSchema),
});

export type HybridReportToolRep = z.infer<typeof HybridReportToolRepSchema>;

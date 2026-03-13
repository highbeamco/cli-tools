import { z } from "zod/v4";

import type { BillRep as ApiBillRep } from "../../bills/reps/BillRep";

export const BillDataSchema = z.object({
  id: z.string(),
  businessGuid: z.uuid(),
  state: z.string(),
  creationMethod: z.string(),
  amountValue: z.string().nullable(),
  amountCurrency: z.string().nullable(),
  invoiceDate: z.string().nullable(),
  invoiceDueDate: z.string().nullable(),
  invoiceNumber: z.string().nullable(),
  payeeGuid: z.string().nullable(),
  memo: z.string().nullable(),
  paymentTerms: z.string().nullable(),
  purchaseOrderNumber: z.string().nullable(),
  duplicateOfBillId: z.string().nullable(),
});

export type BillData = z.infer<typeof BillDataSchema>;

export function toBillData(b: ApiBillRep): BillData {
  return {
    id: b.id,
    businessGuid: b.businessGuid,
    state: b.state,
    creationMethod: b.creationMethod,
    amountValue: b.amount?.amount ?? null,
    amountCurrency: b.amount?.currency ?? null,
    invoiceDate: b.invoiceDate,
    invoiceDueDate: b.invoiceDueDate,
    invoiceNumber: b.invoiceNumber,
    payeeGuid: b.payeeGuid,
    memo: b.memo,
    paymentTerms: b.paymentTerms,
    purchaseOrderNumber: b.purchaseOrderNumber,
    duplicateOfBillId: b.duplicateOfBillId,
  };
}

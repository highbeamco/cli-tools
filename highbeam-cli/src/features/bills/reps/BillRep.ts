import { z } from "zod/v4";

export const MoneySchema = z.object({
  amount: z.string(),
  currency: z.string(),
});

export const BillRepSchema = z.object({
  id: z.string(),
  businessGuid: z.uuid(),
  amount: MoneySchema.nullable(),
  state: z.string(),
  creationMethod: z.string(),
  duplicateOfBillId: z.string().nullable(),
  invoiceDate: z.string().nullable(),
  invoiceDueDate: z.string().nullable(),
  invoiceNumber: z.string().nullable(),
  payeeGuid: z.uuid().nullable(),
  memo: z.string().nullable(),
  paymentTerms: z.string().nullable(),
  purchaseOrderNumber: z.string().nullable(),
});

export type BillRep = z.infer<typeof BillRepSchema>;

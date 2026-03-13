import { z } from "zod/v4";

export const BillToolRepSchema = z.object({
  id: z.string(),
  businessGuid: z.uuid(),
  state: z.string(),
  creationMethod: z.string(),
  amountValue: z.string().nullable(),
  amountCurrency: z.string().nullable(),
  invoiceDate: z.iso.date().nullable(),
  invoiceDueDate: z.iso.date().nullable(),
  invoiceNumber: z.string().nullable(),
  payeeGuid: z.uuid().nullable(),
  memo: z.string().nullable(),
  paymentTerms: z.string().nullable(),
  purchaseOrderNumber: z.string().nullable(),
  duplicateOfBillId: z.string().nullable(),
});

export type BillToolRep = z.infer<typeof BillToolRepSchema>;

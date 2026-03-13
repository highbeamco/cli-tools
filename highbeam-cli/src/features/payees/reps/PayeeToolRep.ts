import { z } from "zod/v4";

export const PayeeToolRepSchema = z.object({
  guid: z.uuid(),
  businessGuid: z.uuid(),
  name: z.string(),
  emailAddress: z.string().nullable(),
  phone: z.string().nullable(),
  is1099Contractor: z.boolean(),
  defaultChartOfAccountId: z.string().nullable(),
  addressLine1: z.string().nullable(),
  addressLine2: z.string().nullable(),
  addressCity: z.string().nullable(),
  addressState: z.string().nullable(),
  addressZipCode: z.string().nullable(),
  addressCountry: z.string().nullable(),
  hasAchTransferMethod: z.boolean(),
  hasWireTransferMethod: z.boolean(),
  hasInternationalWireTransferMethod: z.boolean(),
  lastTransferAt: z.string().nullable(),
  lastTransferAmount: z.number().nullable(),
  lastTransferDescription: z.string().nullable(),
});

export type PayeeToolRep = z.infer<typeof PayeeToolRepSchema>;

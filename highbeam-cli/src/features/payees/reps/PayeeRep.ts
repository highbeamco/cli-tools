import { z } from "zod/v4";

export const AddressSchema = z.object({
  addressLine1: z.string(),
  addressLine2: z.string().optional(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
  country: z.string(),
});

export const AchTransferMethodSchema = z.object({
  routingNumber: z.string(),
  accountNumber: z.string(),
});

export const WireTransferMethodSchema = z.object({
  routingNumber: z.string(),
  accountNumber: z.string(),
});

export const InternationalWireTransferMethodSchema = z.object({
  type: z.string(),
  entity: z.string(),
  bankCountry: z.string(),
  address: AddressSchema,
  accountNumber: z.string().nullable(),
  iban: z.string().nullable(),
  swift: z.string(),
  currency: z.string(),
  bankAccountCategory: z.string().nullable(),
});

export const PayeeRepSchema = z.object({
  guid: z.uuid(),
  businessGuid: z.uuid(),
  name: z.string(),
  defaultChartOfAccountId: z.string().nullable(),
  emailAddress: z.string().nullable(),
  sendEmailNotification: z.boolean(),
  phone: z.string().nullable(),
  is1099Contractor: z.boolean(),
  address: AddressSchema.nullable(),
  achTransferMethod: AchTransferMethodSchema.nullable(),
  wireTransferMethod: WireTransferMethodSchema.nullable(),
  internationalWireTransferMethod: InternationalWireTransferMethodSchema.nullable(),
  lastTransferAt: z.string().nullable(),
  lastTransferAmount: z.number().nullable(),
  lastTransferBankAccountGuid: z.string().nullable(),
  lastTransferDescription: z.string().nullable(),
});

export type PayeeRep = z.infer<typeof PayeeRepSchema>;

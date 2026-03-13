import { z } from "zod/v4";

import type { PayeeRep as ApiPayeeRep } from "../../payees/reps/PayeeRep";

export const PayeeDataSchema = z.object({
  guid: z.uuid(),
  businessGuid: z.uuid(),
  name: z.string(),
  emailAddress: z.string().nullable(),
  phone: z.string().nullable(),
  is1099Contractor: z.boolean(),
  addressLine1: z.string().nullable(),
  addressLine2: z.string().nullable(),
  city: z.string().nullable(),
  state: z.string().nullable(),
  zipCode: z.string().nullable(),
  country: z.string().nullable(),
  hasAchTransferMethod: z.boolean(),
  hasWireTransferMethod: z.boolean(),
  hasInternationalWireTransferMethod: z.boolean(),
  lastTransferAt: z.string().nullable(),
  lastTransferAmount: z.number().nullable(),
  lastTransferDescription: z.string().nullable(),
});

export type PayeeData = z.infer<typeof PayeeDataSchema>;

export function toPayeeData(p: ApiPayeeRep): PayeeData {
  return {
    guid: p.guid,
    businessGuid: p.businessGuid,
    name: p.name,
    emailAddress: p.emailAddress,
    phone: p.phone,
    is1099Contractor: p.is1099Contractor,
    addressLine1: p.address?.addressLine1 ?? null,
    addressLine2: p.address?.addressLine2 ?? null,
    city: p.address?.city ?? null,
    state: p.address?.state ?? null,
    zipCode: p.address?.zipCode ?? null,
    country: p.address?.country ?? null,
    hasAchTransferMethod: p.achTransferMethod !== null,
    hasWireTransferMethod: p.wireTransferMethod !== null,
    hasInternationalWireTransferMethod: p.internationalWireTransferMethod !== null,
    lastTransferAt: p.lastTransferAt,
    lastTransferAmount: p.lastTransferAmount,
    lastTransferDescription: p.lastTransferDescription,
  };
}

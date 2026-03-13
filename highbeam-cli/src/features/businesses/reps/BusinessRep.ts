import { z } from "zod/v4";

export const BusinessRepSchema = z.object({
  guid: z.uuid(),
  dba: z.string().nullable(),
  displayName: z.string().nullable(),
  internalName: z.string().nullable(),
  name: z.string().nullable(),
  ownerUserGuid: z.uuid(),
  unitCoCustomerId: z.string().nullable(),
  referralLinkGuid: z.string().nullable(),
  status: z.string(),
  stateOfIncorporation: z.string().nullable(),
});

export type BusinessRep = z.infer<typeof BusinessRepSchema>;

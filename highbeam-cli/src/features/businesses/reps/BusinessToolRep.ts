import { z } from "zod/v4";

export const BusinessToolRepSchema = z.object({
  guid: z.uuid(),
  name: z.string().nullable(),
  dba: z.string().nullable(),
  displayName: z.string().nullable(),
  internalName: z.string().nullable(),
  ownerUserGuid: z.uuid(),
  unitCoCustomerId: z.string().nullable(),
  referralLinkGuid: z.string().nullable(),
  status: z.string(),
  stateOfIncorporation: z.string().nullable(),
});

export type BusinessToolRep = z.infer<typeof BusinessToolRepSchema>;

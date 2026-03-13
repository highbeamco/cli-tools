import { z } from "zod/v4";

import type { BusinessRep as ApiBusinessRep } from "../../businesses/reps/BusinessRep";

export const BusinessDataSchema = z.object({
  guid: z.uuid(),
  name: z.string().nullable(),
  dba: z.string().nullable(),
  displayName: z.string().nullable(),
  status: z.string(),
  stateOfIncorporation: z.string().nullable(),
});

export type BusinessData = z.infer<typeof BusinessDataSchema>;

export function toBusinessData(b: ApiBusinessRep): BusinessData {
  return {
    guid: b.guid,
    name: b.name,
    dba: b.dba,
    displayName: b.displayName,
    status: b.status,
    stateOfIncorporation: b.stateOfIncorporation,
  };
}

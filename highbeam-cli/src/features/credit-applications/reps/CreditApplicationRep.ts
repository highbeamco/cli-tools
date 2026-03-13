import { z } from "zod/v4";

export const OfferSchema = z.object({
  initialLimit: z.number(),
  nextLimit: z.number(),
  goalLimit: z.number(),
  apr: z.number(),
});

export const UserProvidedDetailsSchema = z.object({
  userNotes: z.string().optional(),
  requestedAmount: z.number().optional(),
  reasonForRequest: z.string().optional(),
  industry: z.string().optional(),
  otherIndustry: z.string().optional(),
  numberOfRetailLocations: z.number().optional(),
  inventoryLeadTime: z.string().optional(),
});

export const CreditApplicationRepSchema = z.object({
  guid: z.uuid(),
  state: z.string(),
  submittedAt: z.string().nullable(),
  canReapplyAfter: z.string().nullable(),
  offer: OfferSchema.nullable(),
  userProvidedDetails: UserProvidedDetailsSchema.nullable(),
});

export type CreditApplicationRep = z.infer<typeof CreditApplicationRepSchema>;

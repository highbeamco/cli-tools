import { z } from "zod/v4";

export const PaymentToolRepSchema = z.object({
  guid: z.uuid(),
  businessGuid: z.uuid(),
  bankAccountGuid: z.uuid(),
  amount: z.number(),
  description: z.string(),
  status: z.string(),
  createdByUserGuid: z.uuid(),
  createdAt: z.iso.datetime(),
  scheduledFor: z.iso.datetime().nullable(),
  sentByUserGuid: z.uuid().nullable(),
  sentAt: z.iso.datetime().nullable(),
  rejectedByUserGuid: z.uuid().nullable(),
  rejectedAt: z.iso.datetime().nullable(),
  reason: z.string().nullable(),
  notificationEmailAddress: z.string().nullable(),
  idempotencyKey: z.string(),
});

export type PaymentToolRep = z.infer<typeof PaymentToolRepSchema>;

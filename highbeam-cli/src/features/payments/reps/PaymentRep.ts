import { z } from "zod/v4";

const MoneySchema = z.object({
  amount: z.number(),
  currency: z.string(),
});

const PaymentAccountSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("Unit"),
    unitAccountId: z.string(),
  }),
  z.object({
    type: z.literal("Capital"),
    capitalAccountGuid: z.uuid(),
  }),
  z.object({
    type: z.literal("Lender"),
    lender: z.string(),
    capitalAccountGuid: z.uuid(),
  }),
]);

export const PaymentRepSchema = z.object({
  id: z.string(),
  idempotencyKey: z.string(),
  businessGuid: z.uuid(),
  state: z.enum(["Created", "Settled", "Failed"]),
  amount: MoneySchema,
  fromAccount: PaymentAccountSchema,
  toAccount: PaymentAccountSchema,
  description: z.string().nullable(),
  requestId: z.string().nullable(),
  externalId: z.string().nullable(),
  provider: z.string().nullable(),
});

export type PaymentRep = z.infer<typeof PaymentRepSchema>;

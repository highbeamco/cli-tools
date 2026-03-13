import { z } from "zod/v4";

export const BankAccountToolRepSchema = z.object({
  guid: z.uuid(),
  businessGuid: z.uuid(),
  name: z.string(),
  status: z.string(),
  isPrimary: z.boolean(),
  availableBalance: z.number(),
  routingNumber: z.string(),
  accountNumber: z.string(),
  unitCoDepositAccountId: z.string(),
  highbeamTypeName: z.string(),
  depositProductName: z.string().nullable(),
  depositProductInterestBps: z.number().nullable(),
  sameDayAch: z.boolean().nullable(),
});

export type BankAccountToolRep = z.infer<typeof BankAccountToolRepSchema>;

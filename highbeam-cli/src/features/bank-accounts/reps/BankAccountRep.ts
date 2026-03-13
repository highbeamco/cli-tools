import { z } from "zod/v4";

export const HighbeamAccountTypeSchema = z.object({
  name: z.string(),
  includeInTotalBalance: z.boolean(),
  includeInTransferMoney: z.boolean(),
  includeInSendMoney: z.boolean(),
  showDetailsToUser: z.boolean(),
  supportsDebitCards: z.boolean(),
  supportsExternalTransfers: z.boolean(),
});

export const DepositProductSchema = z.object({
  name: z.string(),
  interestBps: z.number(),
  checkClearingDays: z.number(),
  sameDayAch: z.boolean(),
});

export const BankAccountRepSchema = z.object({
  guid: z.uuid(),
  businessGuid: z.uuid(),
  name: z.string(),
  status: z.string(),
  isPrimary: z.boolean(),
  availableBalance: z.number(),
  routingNumber: z.string(),
  accountNumber: z.string(),
  unitCoDepositAccountId: z.string(),
  type: z.string(),
  highbeamType: HighbeamAccountTypeSchema,
  depositProduct: DepositProductSchema.nullable(),
});

export type BankAccountRep = z.infer<typeof BankAccountRepSchema>;

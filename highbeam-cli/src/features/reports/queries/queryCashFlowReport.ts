import { z } from "zod/v4";

import type { BackendApiV2 } from "../../../shared/api/BackendApi.js";
import { postQuery, type PostQuery } from "../../../shared/api/query.js";
import { CashFlowReportRepSchema } from "../reps/CashFlowReportRep.js";

export type QueryCashFlowReportParams = {
  businessGuid: string;
  end: string;
  interval: string;
  periods: number;
};

export const QueryCashFlowReportResultSchema = CashFlowReportRepSchema;
export type QueryCashFlowReportResult = z.infer<typeof QueryCashFlowReportResultSchema>;

const QueryCashFlowReportQuery: PostQuery<
  BackendApiV2,
  QueryCashFlowReportParams,
  QueryCashFlowReportResult
> = {
  name: "queryCashFlowReport",
  path: () => `insights/cash-flow-reports`,
  body: ({ businessGuid, end, interval, periods }) => ({
    businessGuid,
    end,
    interval,
    periods,
  }),
  responseSchema: QueryCashFlowReportResultSchema,
};

export const queryCashFlowReport = async (
  api: BackendApiV2,
  params: QueryCashFlowReportParams,
): Promise<QueryCashFlowReportResult> => {
  return postQuery(api, QueryCashFlowReportQuery, params);
};

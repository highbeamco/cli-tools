import { z } from "zod/v4";

import type { BackendApiV2 } from "../../../shared/api/BackendApi";
import { postQuery, type PostQuery } from "../../../shared/api/query";
import { HybridReportRepSchema } from "../reps/HybridReportRep";

export type QueryHybridReportParams = {
  businessGuid: string;
  end: string;
  interval: string;
  periods: number;
};

export const QueryHybridReportResultSchema = HybridReportRepSchema;
export type QueryHybridReportResult = z.infer<typeof QueryHybridReportResultSchema>;

const QueryHybridReportQuery: PostQuery<
  BackendApiV2,
  QueryHybridReportParams,
  QueryHybridReportResult
> = {
  name: "queryHybridReport",
  path: () => `insights/hybrid-reports`,
  body: ({ businessGuid, end, interval, periods }) => ({
    businessGuid,
    end,
    interval,
    periods,
  }),
  responseSchema: QueryHybridReportResultSchema,
};

export const queryHybridReport = async (
  api: BackendApiV2,
  params: QueryHybridReportParams,
): Promise<QueryHybridReportResult> => {
  return postQuery(api, QueryHybridReportQuery, params);
};

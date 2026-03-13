import { Env } from "shared/env/env";
import { AuthTokenStore } from "services/auth/auth-token-store";
import { ServerTokenAuthService } from "services/auth/server-token-auth-service";
import { getBusinessGuid } from "shared/config/config-store";
import { toCashFlowReportData } from "../features/dataschema/reps/CashFlowReportRep";

export async function cashFlowReportAction(opts: {
  end?: string;
  interval?: string;
  periods?: string;
  business?: string;
}) {
  const env = new Env();
  const tokenStore = new AuthTokenStore(env.HIGHBEAM_STORAGE_PATH);
  const authService = new ServerTokenAuthService(env, tokenStore);

  if (!(await authService.tryLoadOrRefresh())) {
    console.log("Not authenticated. Please run `highbeam login` first.");
    authService.dispose();
    return;
  }

  const businessGuid = getBusinessGuid(opts.business);

  const { BackendApisProvider } = await import("services/api/backend-apis-provider");
  const { queryCashFlowReport } = await import(
    "../features/reports/queries/queryCashFlowReport"
  );

  const apisProvider = new BackendApisProvider(env);
  const apis = apisProvider.createForToken(() => authService.getAccessToken(undefined)!);

  const report = await queryCashFlowReport(apis.v2, {
    businessGuid,
    end: opts.end ?? new Date().toISOString().split("T")[0],
    interval: opts.interval ?? "P7D",
    periods: opts.periods ? parseInt(opts.periods, 10) : 13,
  });

  const result = toCashFlowReportData(report);
  console.log(JSON.stringify(result, null, 2));

  authService.dispose();
}

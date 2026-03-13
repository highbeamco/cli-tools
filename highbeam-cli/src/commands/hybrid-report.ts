import { Env } from "shared/env/env";
import { AuthTokenStore } from "services/auth/auth-token-store";
import { ServerTokenAuthService } from "services/auth/server-token-auth-service";
import { getBusinessGuid } from "shared/config/config-store";
import { toHybridReportData } from "../features/dataschema/reps/HybridReportRep";

export async function hybridReportAction(opts: {
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
  const { queryHybridReport } = await import(
    "../features/reports/queries/queryHybridReport"
  );

  const apisProvider = new BackendApisProvider(env);
  const apis = apisProvider.createForToken(() => authService.getAccessToken(undefined)!);

  const report = await queryHybridReport(apis.v2, {
    businessGuid,
    end: opts.end ?? new Date().toISOString().split("T")[0],
    interval: opts.interval ?? "P7D",
    periods: opts.periods ? parseInt(opts.periods, 10) : 13,
  });

  const result = toHybridReportData(report);
  console.log(JSON.stringify(result, null, 2));

  authService.dispose();
}

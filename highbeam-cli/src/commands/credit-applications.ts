import { Env } from "shared/env/env";
import { AuthTokenStore } from "services/auth/auth-token-store";
import { ServerTokenAuthService } from "services/auth/server-token-auth-service";
import { getBusinessGuid } from "shared/config/config-store";
import { toCreditApplicationData } from "../features/dataschema/reps/CreditApplicationRep";

export async function creditApplicationsAction(opts: { business?: string }) {
  const env = new Env();
  const tokenStore = new AuthTokenStore(env.HIGHBEAM_STORAGE_PATH);
  const authService = new ServerTokenAuthService(env, tokenStore);

  if (!authService.tryLoadFromFile()) {
    console.log("Not authenticated. Please run `highbeam login` first.");
    authService.dispose();
    return;
  }

  const businessGuid = getBusinessGuid(opts.business);

  const { BackendApisProvider } = await import("services/api/backend-apis-provider");
  const { queryCreditApplications } = await import(
    "../features/credit-applications/queries/queryCreditApplications"
  );

  const apisProvider = new BackendApisProvider(env);
  const apis = apisProvider.createForToken(() => authService.getAccessToken(undefined)!);

  const applications = await queryCreditApplications(apis.v1, { businessGuid });
  const result = applications.map(toCreditApplicationData);
  console.log(JSON.stringify(result, null, 2));

  authService.dispose();
}

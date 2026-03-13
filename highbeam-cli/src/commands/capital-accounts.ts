import { Env } from "shared/env/env";
import { AuthTokenStore } from "services/auth/auth-token-store";
import { ServerTokenAuthService } from "services/auth/server-token-auth-service";
import { getBusinessGuid } from "shared/config/config-store";
import { toCapitalAccountData } from "../features/dataschema/reps/CapitalAccountRep";

export async function capitalAccountsAction(opts: { business?: string }) {
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
  const { queryCapitalAccounts } = await import(
    "../features/capital-accounts/queries/queryCapitalAccounts"
  );

  const apisProvider = new BackendApisProvider(env);
  const apis = apisProvider.createForToken(() => authService.getAccessToken(undefined)!);

  const capitalAccounts = await queryCapitalAccounts(apis.v1, { businessGuid });
  const result = capitalAccounts.map(toCapitalAccountData);
  console.log(JSON.stringify(result, null, 2));

  authService.dispose();
}

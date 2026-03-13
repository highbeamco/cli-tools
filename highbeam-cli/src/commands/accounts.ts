import { Env } from "shared/env/env";
import { AuthTokenStore } from "services/auth/auth-token-store";
import { ServerTokenAuthService } from "services/auth/server-token-auth-service";
import { getBusinessGuid } from "shared/config/config-store";
import { toBankAccountData } from "../features/dataschema/reps/BankAccountRep";

export async function accountsAction(opts: { business?: string }) {
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
  const { queryBankAccounts } = await import(
    "../features/bank-accounts/queries/queryBankAccounts"
  );

  const apisProvider = new BackendApisProvider(env);
  const apis = apisProvider.createForToken(() => authService.getAccessToken(undefined)!);

  const accounts = await queryBankAccounts(apis.v1, { businessGuid });
  const result = accounts.map(toBankAccountData);
  console.log(JSON.stringify(result, null, 2));

  authService.dispose();
}

import { Env } from "shared/env/env";
import { AuthTokenStore } from "services/auth/auth-token-store";
import { ServerTokenAuthService } from "services/auth/server-token-auth-service";
import { getBusinessGuid } from "shared/config/config-store";
import { toTransactionData } from "../features/dataschema/reps/TransactionRep";

export async function transactionsAction(opts: {
  limit?: string;
  offset?: string;
  business?: string;
}) {
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
  const { queryEnrichedTransactions } = await import(
    "../features/transactions/queries/queryEnrichedTransactions"
  );

  const apisProvider = new BackendApisProvider(env);
  const apis = apisProvider.createForToken(() => authService.getAccessToken(undefined)!);

  const limit = opts.limit ? parseInt(opts.limit, 10) : 20;
  const offset = opts.offset ? parseInt(opts.offset, 10) : 0;

  const enriched = await queryEnrichedTransactions(apis.v2, {
    businessGuid,
    limit,
    offset,
  });

  const result = enriched.map(toTransactionData);
  console.log(JSON.stringify(result, null, 2));

  authService.dispose();
}

import { Env } from "shared/env/env";
import { AuthTokenStore } from "services/auth/auth-token-store";
import { ServerTokenAuthService } from "services/auth/server-token-auth-service";
import { getBusinessGuid } from "shared/config/config-store";
import { toCardData } from "../features/dataschema/reps/CardRep";

export async function cardsAction(opts: { business?: string }) {
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
  const { queryCards } = await import("../features/cards/queries/queryCards");

  const apisProvider = new BackendApisProvider(env);
  const apis = apisProvider.createForToken(() => authService.getAccessToken(undefined)!);

  const cards = await queryCards(apis.v1, { businessGuid });
  const result = cards.map(toCardData);
  console.log(JSON.stringify(result, null, 2));

  authService.dispose();
}

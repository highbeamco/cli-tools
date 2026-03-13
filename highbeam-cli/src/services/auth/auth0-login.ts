import { execSync } from "node:child_process";
import { createHash, randomBytes } from "node:crypto";

import type { Env } from "shared/env/env";
import { logger } from "../logger";

export interface Auth0LoginState {
  state: string;
  codeVerifier: string;
  redirectUri: string;
}

export async function initiateAuth0Login(env: Env, port: number): Promise<Auth0LoginState> {
  const state = randomBytes(32).toString("base64url");
  const codeVerifier = randomBytes(32).toString("base64url");
  const codeChallenge = createHash("sha256").update(codeVerifier).digest("base64url");
  const redirectUri = `http://localhost:${port}/auth_callback`;

  const authUrl = new URL("/authorize", env.HIGHBEAM_AUTH_ORIGIN);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("client_id", env.AUTH0_CLIENT_ID);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("scope", "openid profile email offline_access");
  authUrl.searchParams.set("audience", `https://${env.AUTH0_TENANT_DOMAIN}/api/v2/`);
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("code_challenge", codeChallenge);
  authUrl.searchParams.set("code_challenge_method", "S256");

  logger.info("[auth] Opening browser for Auth0 login...");
  execSync(`open "${authUrl.toString()}"`);

  return { state, codeVerifier, redirectUri };
}

export interface Auth0TokenResponse {
  accessToken: string;
  refreshToken: string | undefined;
  expiresIn: number;
}

export async function exchangeCodeForToken(
  env: Env,
  code: string,
  loginState: Auth0LoginState,
): Promise<Auth0TokenResponse> {
  const tokenUrl = new URL("/oauth/token", env.HIGHBEAM_AUTH_ORIGIN);

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "authorization_code",
      client_id: env.AUTH0_CLIENT_ID,
      code_verifier: loginState.codeVerifier,
      code,
      redirect_uri: loginState.redirectUri,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Auth0 token exchange failed (${response.status}): ${body}`);
  }

  const data = (await response.json()) as {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
  };

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
  };
}

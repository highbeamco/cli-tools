import { execSync } from "node:child_process";
import { createHash, randomBytes } from "node:crypto";

import { logger } from "../logger";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";

export interface GoogleLoginState {
  state: string;
  codeVerifier: string;
  redirectUri: string;
}

export function initiateGoogleLogin(
  clientId: string,
  scopes: string[],
  port: number,
): GoogleLoginState {
  const state = randomBytes(32).toString("base64url");
  const codeVerifier = randomBytes(32).toString("base64url");
  const codeChallenge = createHash("sha256").update(codeVerifier).digest("base64url");
  const redirectUri = `http://localhost:${port}/google_callback`;

  const authUrl = new URL(GOOGLE_AUTH_URL);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("scope", scopes.join(" "));
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("code_challenge", codeChallenge);
  authUrl.searchParams.set("code_challenge_method", "S256");
  authUrl.searchParams.set("access_type", "offline");
  authUrl.searchParams.set("prompt", "consent");

  logger.info("[google-auth] Opening browser for Google login...");
  execSync(`open "${authUrl.toString()}"`);

  return { state, codeVerifier, redirectUri };
}

export interface GoogleTokenResponse {
  accessToken: string;
  refreshToken: string | undefined;
  expiresIn: number;
  scope: string;
}

export async function exchangeGoogleCode(
  clientId: string,
  clientSecret: string,
  code: string,
  loginState: GoogleLoginState,
): Promise<GoogleTokenResponse> {
  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: clientId,
      client_secret: clientSecret,
      code_verifier: loginState.codeVerifier,
      code,
      redirect_uri: loginState.redirectUri,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Google token exchange failed (${response.status}): ${body}`);
  }

  const data = (await response.json()) as {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
    scope: string;
  };

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
    scope: data.scope,
  };
}

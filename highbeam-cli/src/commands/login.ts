import type { AddressInfo } from "node:net";

import express from "express";

import { Env } from "shared/env/env";
import { AuthTokenStore } from "services/auth/auth-token-store";
import { ServerTokenAuthService } from "services/auth/server-token-auth-service";
import { initiateAuth0Login, exchangeCodeForToken } from "services/auth/auth0-login";

export async function loginAction(opts: { force?: boolean }) {
  const env = new Env();
  const tokenStore = new AuthTokenStore(env.HIGHBEAM_STORAGE_PATH);
  const authService = new ServerTokenAuthService(env, tokenStore);

  // Check if already authenticated
  if (!opts.force && authService.tryLoadFromFile()) {
    console.log("Already authenticated. Use --force to re-authenticate.");
    authService.dispose();
    return;
  }

  const app = express();
  const server = app.listen(env.MCP_PORT, env.MCP_HOST);

  await new Promise<void>((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });

  const port = (server.address() as AddressInfo).port;
  const loginState = await initiateAuth0Login(env, port);

  console.log("Opening browser for login...");
  console.log("Waiting for authentication callback...");

  await new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error("Login timed out after 120 seconds"));
    }, 120_000);

    app.get("/auth_callback", async (req, res) => {
      clearTimeout(timeout);

      const { code, state, error, error_description } = req.query as Record<
        string,
        string | undefined
      >;

      if (error) {
        res.status(400).send(`Authentication error: ${error_description ?? error}`);
        reject(new Error(`Auth0 callback error: ${error}`));
        return;
      }

      if (!code) {
        res.status(400).send("Missing authorization code");
        reject(new Error("Missing authorization code"));
        return;
      }

      if (state !== loginState.state) {
        res.status(400).send("Invalid state parameter");
        reject(new Error("Invalid state parameter"));
        return;
      }

      try {
        const tokens = await exchangeCodeForToken(env, code, loginState);
        authService.setTokens(tokens);
        res.send("<html><body><h1>Authenticated!</h1><p>You can close this tab.</p></body></html>");
        resolve();
      } catch (err) {
        res.status(500).send("Token exchange failed");
        reject(err);
      }
    });
  });

  server.close();
  authService.dispose();
  console.log("Login successful! Token stored to ~/.highbeam/auth-token.json");
}

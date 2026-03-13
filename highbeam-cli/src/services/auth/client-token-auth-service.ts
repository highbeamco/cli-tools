import type { AuthService } from "./auth-service";

export class ClientTokenAuthService implements AuthService {
  getAccessToken(authorizationHeader: string | undefined): string | null {
    if (!authorizationHeader?.startsWith("Bearer ")) return null;
    return authorizationHeader.slice("Bearer ".length);
  }
}

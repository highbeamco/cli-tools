export interface AuthService {
  /**
   * Returns the access token to use for backend API calls,
   * or null if the request is not authenticated.
   */
  getAccessToken(authorizationHeader: string | undefined): string | null;
}

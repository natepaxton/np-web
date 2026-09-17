import { EnvironmentProviders } from '@angular/core';
import { provideAuth0 } from '@auth0/auth0-angular';

/**
 * Auth0 tenant settings for the np-aspire SPA. All three values are public in a browser app;
 * np-aspire-api validates the tokens and enforces every access rule. The Auth0 side of this —
 * the SPA client, the API, the roles, and the test users — is managed by Terraform in
 * np-aspire-api (`infra/auth0`), so change it there, never in the Auth0 dashboard.
 *
 * `audience` is the API's Auth0 identifier, not an address the app calls. Requests to the
 * backend stay relative (`/api/v1/...`).
 */
const authConfig = {
  domain: 'nate-paxton.auth0.com',
  clientId: 'bMCqpBAFVb0NWPuHZp74Suxz9ggsADST',
  audience: 'https://api.np-aspire.com',
} as const;

export interface NpAuthOptions {
  /**
   * Base the app calls the API through, used to build the interceptor's `allowedList`.
   *
   * Empty (the default) means same-origin: apps call relative `/api/v1/...` URLs and the dev-server
   * proxy forwards them, which is what §2 of the spec describes. An absolute origin such as
   * `http://localhost:5104` makes the calls cross-origin instead, which needs CORS on the API.
   *
   * Pass the same value the HTTP layer uses as its base. If the two disagree the interceptor stops
   * matching, and every call fails as unauthenticated with nothing else looking wrong.
   */
  apiBase?: string;
}

/**
 * Wires the Auth0 Angular SDK into an app: Authorization Code + PKCE against the tenant above,
 * asking for tokens for the np-aspire API so they come back as JWT access tokens the API can
 * validate. Tokens stay in memory (the SDK default) rather than in `localStorage`, and refresh
 * token rotation renews them — the API allows offline access and the SPA client is configured for
 * rotating refresh tokens.
 *
 * `useRefreshTokensFallback` matters because of that memory cache: the refresh token lives in a
 * web worker that dies with the page, so after a reload there is nothing to refresh with and the
 * SDK would throw `Missing Refresh Token`. The fallback lets it get a fresh pair from the hidden
 * iframe (`prompt=none`) using the Auth0 session cookie. That path needs third-party cookies, so
 * it will want an Auth0 custom domain before it can be relied on outside of dev.
 *
 * The SDK's HTTP interceptor attaches those access tokens, but only to the API URLs in
 * `allowedList`, so a token can never leak to a third-party host. Apps still have to register
 * `authHttpInterceptorFn` with `provideHttpClient` for it to run.
 *
 * Still to come with the API client (milestone 2): the permission helpers over
 * `GET /api/v1/users/me`.
 */
export function provideNpAuth(options: NpAuthOptions = {}): EnvironmentProviders {
  // A trailing slash would produce `//api/*`, which matches nothing.
  const apiBase = (options.apiBase ?? '').replace(/\/$/, '');

  return provideAuth0({
    domain: authConfig.domain,
    clientId: authConfig.clientId,
    authorizationParams: {
      redirect_uri: window.location.origin,
      audience: authConfig.audience,
    },
    useRefreshTokens: true,
    useRefreshTokensFallback: true,
    httpInterceptor: {
      // One wildcard covers the whole API, relative or absolute.
      allowedList: [{ uri: `${apiBase}/api/*` }],
    },
  });
}

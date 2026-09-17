import { InjectionToken } from '@angular/core';

/**
 * Base the sandbox calls the API through, and the one place to change it.
 *
 * Empty means same-origin: the app calls relative `/api/v1/...` URLs and the dev server's proxy
 * (`proxy.conf.mjs`, target `API_URL`) forwards them, so the browser sees one origin and the API
 * needs no CORS. Setting an absolute origin such as `http://localhost:5104` calls the API directly
 * instead, which does need CORS on the API for this app's origin.
 *
 * `app.config.ts` passes this to both `provideNpAuth()` and `API_BASE_URL`, so the interceptor's
 * allowlist can never disagree with the URLs the app actually calls.
 */
export const apiBase = '';

/** Injected wherever the app builds an API URL. */
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => apiBase,
});

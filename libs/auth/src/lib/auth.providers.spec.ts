import { TestBed } from '@angular/core/testing';
import { AuthClientConfig } from '@auth0/auth0-angular';
import { provideNpAuth } from './auth.providers';

describe('provideNpAuth', () => {
  function configFor(...providers: ReturnType<typeof provideNpAuth>[]) {
    TestBed.configureTestingModule({ providers });
    return TestBed.inject(AuthClientConfig).get();
  }

  it('configures the SDK for the np-aspire tenant', () => {
    expect(configFor(provideNpAuth())).toEqual({
      domain: 'nate-paxton.auth0.com',
      clientId: 'bMCqpBAFVb0NWPuHZp74Suxz9ggsADST',
      authorizationParams: {
        redirect_uri: window.location.origin,
        audience: 'https://api.np-aspire.com',
      },
      useRefreshTokens: true,
      useRefreshTokensFallback: true,
      httpInterceptor: { allowedList: [{ uri: '/api/*' }] },
    });
  });

  it('allows relative API URLs by default', () => {
    expect(configFor(provideNpAuth()).httpInterceptor?.allowedList).toEqual([{ uri: '/api/*' }]);
  });

  it('matches an absolute API base, so a cross-origin call still gets a token', () => {
    const allowedList = configFor(provideNpAuth({ apiBase: 'http://localhost:5104' })).httpInterceptor?.allowedList;

    expect(allowedList).toEqual([{ uri: 'http://localhost:5104/api/*' }]);
  });

  it('ignores a trailing slash on the base', () => {
    const allowedList = configFor(provideNpAuth({ apiBase: 'http://localhost:5104/' })).httpInterceptor?.allowedList;

    expect(allowedList).toEqual([{ uri: 'http://localhost:5104/api/*' }]);
  });
});

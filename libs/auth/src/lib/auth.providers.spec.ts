import { TestBed } from '@angular/core/testing';
import { AuthClientConfig } from '@auth0/auth0-angular';
import { provideNpAuth } from './auth.providers';

describe('provideNpAuth', () => {
  it('configures the SDK for the np-aspire tenant', () => {
    TestBed.configureTestingModule({ providers: [provideNpAuth()] });

    expect(TestBed.inject(AuthClientConfig).get()).toEqual({
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
});

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { authHttpInterceptorFn } from '@auth0/auth0-angular';
import { provideNpAuth } from '@np-aspire/auth';
import { provideSpartanHlm } from '@spartan-ng/helm/utils';
import { apiBase } from './api';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes, withComponentInputBinding()),
    provideSpartanHlm(),
    provideNpAuth({ apiBase }),
    // The interceptor attaches an access token to the `/api/*` calls provideNpAuth() allows.
    provideHttpClient(withInterceptors([authHttpInterceptorFn])),
  ],
};

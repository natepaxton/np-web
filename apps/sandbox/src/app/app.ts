import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { HlmButton } from '@spartan-ng/helm/button';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive, HlmButton],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly auth = inject(AuthService);

  /** One entry per API area as endpoints are added. */
  protected readonly navItems = [
    { label: 'Home', path: '/' },
    { label: 'Profile', path: '/profile' },
  ];

  protected readonly isLoading = toSignal(this.auth.isLoading$, { initialValue: true });
  protected readonly isAuthenticated = toSignal(this.auth.isAuthenticated$, { initialValue: false });
  protected readonly user = toSignal(this.auth.user$);

  protected logIn(): void {
    this.auth.loginWithRedirect();
  }

  protected signUp(): void {
    this.auth.loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } });
  }

  protected logOut(): void {
    this.auth.logout({ logoutParams: { returnTo: window.location.origin } });
  }
}

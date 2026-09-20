import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  imports: [RouterModule],
  selector: 'ys-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly auth = inject(AuthService);

  protected readonly navItems = [{ label: 'Fuel', path: '/fuel' }];

  protected readonly isLoading = toSignal(this.auth.isLoading$, { initialValue: true });
  protected readonly isAuthenticated = toSignal(this.auth.isAuthenticated$, { initialValue: false });
  protected readonly user = toSignal(this.auth.user$);
  protected readonly error = toSignal(this.auth.error$);

  protected logIn(): void {
    this.auth.loginWithRedirect();
  }

  protected logOut(): void {
    this.auth.logout({ logoutParams: { returnTo: window.location.origin } });
  }
}

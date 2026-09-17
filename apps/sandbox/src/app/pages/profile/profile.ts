import { Component, inject } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '@auth0/auth0-angular';
import { Panel } from '@np-aspire/ui';

@Component({
  selector: 'app-profile',
  imports: [JsonPipe, Panel],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  private readonly auth = inject(AuthService);

  protected readonly isLoading = toSignal(this.auth.isLoading$, { initialValue: true });
  protected readonly user = toSignal(this.auth.user$);
  protected readonly error = toSignal(this.auth.error$);
}

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { Panel } from '@np-aspire/ui';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmInput } from '@spartan-ng/helm/input';

/** What the last `/api/v1/auth/check` call returned. */
interface CheckResult {
  ok: boolean;
  status: number;
  detail: string;
}

@Component({
  selector: 'app-home',
  imports: [Panel, HlmButton, HlmInput],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly http = inject(HttpClient);

  protected readonly name = signal('');
  protected readonly greeting = signal<string | null>(null);

  protected readonly checking = signal(false);
  protected readonly checkResult = signal<CheckResult | null>(null);

  protected greet(): void {
    const name = this.name().trim();
    this.greeting.set(name ? `Hello, ${name}!` : null);
  }

  /**
   * Calls the API's protected probe endpoint. The Auth0 interceptor attaches the access token,
   * and the API decides the outcome: 401 without a token, 403 for a user with no role.
   */
  protected checkApiAuth(): void {
    this.checking.set(true);
    this.checkResult.set(null);

    this.http.get('/api/v1/auth/check', { observe: 'response', responseType: 'text' }).subscribe({
      next: (response) => {
        this.checking.set(false);
        this.checkResult.set({ ok: true, status: response.status, detail: response.body ?? '' });
      },
      error: (error: HttpErrorResponse) => {
        this.checking.set(false);
        this.checkResult.set({ ok: false, status: error.status, detail: error.statusText || error.message });
      },
    });
  }
}

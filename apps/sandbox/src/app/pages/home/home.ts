import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { Panel } from '@np-aspire/ui';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmInput } from '@spartan-ng/helm/input';

/** How the last `/api/v1/auth/check` call went, ready to display. */
interface CheckResult {
  ok: boolean;
  message: string;
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
        this.checkResult.set({ ok: true, message: `${response.status} — ${response.body ?? ''}` });
      },
      error: (error: unknown) => {
        this.checking.set(false);
        this.checkResult.set({ ok: false, message: describeFailure(error) });
      },
    });
  }
}

/**
 * The call can fail before it reaches the API: the interceptor asks the SDK for an access token
 * first, and that throws when there is no session to renew from. Those failures have no HTTP
 * status, so printing one would be misleading.
 */
function describeFailure(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    return `${error.status} — ${error.statusText || error.message}`;
  }
  return `No token — ${error instanceof Error ? error.message : String(error)}`;
}

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { Panel } from '@np-aspire/ui';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmInput } from '@spartan-ng/helm/input';
import { API_BASE_URL } from '../../api';

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
  private readonly apiBase = inject(API_BASE_URL);

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

    this.http.get(`${this.apiBase}/api/v1/auth/check`, { observe: 'response', responseType: 'text' }).subscribe({
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
 * Describes a failed call without inventing a status for it.
 *
 * Three ways this goes wrong, and they look nothing alike: the API answers with a status (403 for
 * a user without the permission), the request never reaches it (status 0 — the dev proxy's
 * upstream is down, or the browser blocked it), or the Auth0 interceptor fails first because it
 * could not get an access token, which is not an `HttpErrorResponse` at all.
 */
function describeFailure(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    return error.status === 0 ? `No response — ${error.message}` : `${error.status} — ${error.statusText}`;
  }
  return `No token — ${error instanceof Error ? error.message : String(error)}`;
}

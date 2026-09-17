import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { throwError } from 'rxjs';
import { Home } from './home';

/** The sandbox's API base is empty, so calls stay relative. */
const checkUrl = '/api/v1/auth/check';

function buttons(fixture: ComponentFixture<Home>): HTMLButtonElement[] {
  return Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('button'));
}

function resultText(fixture: ComponentFixture<Home>): string | undefined {
  return (fixture.nativeElement as HTMLElement).querySelector('[data-testid="api-check-result"]')?.textContent;
}

describe('Home', () => {
  let http: HttpTestingController;

  async function render(): Promise<ComponentFixture<Home>> {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
    const fixture = TestBed.createComponent(Home);
    await fixture.whenStable();
    return fixture;
  }

  afterEach(() => http.verify());

  it('greets the entered name', async () => {
    const fixture = await render();
    const el = fixture.nativeElement as HTMLElement;
    const input = el.querySelector('input') as HTMLInputElement;
    input.value = 'Ada';
    input.dispatchEvent(new Event('input'));
    buttons(fixture)[0].click();
    await fixture.whenStable();
    expect(el.querySelector('[data-testid="greeting"]')?.textContent).toBe('Hello, Ada!');
  });

  it('shows no greeting for a blank name', async () => {
    const fixture = await render();
    buttons(fixture)[0].click();
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).querySelector('[data-testid="greeting"]')).toBeNull();
  });

  describe('API auth check', () => {
    it('reports the status when the API allows the call', async () => {
      const fixture = await render();
      buttons(fixture)[1].click();

      const request = http.expectOne(checkUrl);
      expect(request.request.method).toBe('GET');
      request.flush('authenticated', { status: 200, statusText: 'OK' });
      await fixture.whenStable();

      expect(resultText(fixture)).toContain('200');
      expect(resultText(fixture)).toContain('authenticated');
    });

    it('reports the status when the API refuses the call', async () => {
      const fixture = await render();
      buttons(fixture)[1].click();

      http.expectOne(checkUrl).flush('', { status: 403, statusText: 'Forbidden' });
      await fixture.whenStable();

      expect(resultText(fixture)).toContain('403');
      expect(resultText(fixture)).toContain('Forbidden');
    });

    it('shows the status alone when the API answers with no body', async () => {
      const fixture = await render();
      buttons(fixture)[1].click();

      // What GET /api/v1/auth/check actually returns: Ok() with no content.
      http.expectOne(checkUrl).flush(null, { status: 200, statusText: 'OK' });
      await fixture.whenStable();

      expect(resultText(fixture)).toBe('200 — ');
    });

    it('says there was no response when the request never reached the API', async () => {
      const fixture = await render();
      buttons(fixture)[1].click();

      // Status 0: the dev proxy's upstream is down, or the browser blocked the call.
      http.expectOne(checkUrl).error(new ProgressEvent('error'));
      await fixture.whenStable();

      expect(resultText(fixture)).toContain('No response —');
      expect(resultText(fixture)).not.toContain('0 —');
    });

    it('disables the button while the call is in flight', async () => {
      const fixture = await render();
      buttons(fixture)[1].click();
      await fixture.whenStable();

      expect(buttons(fixture)[1].disabled).toBe(true);
      expect(buttons(fixture)[1].textContent?.trim()).toBe('Calling…');

      http.expectOne(checkUrl).flush('ok');
      await fixture.whenStable();
      expect(buttons(fixture)[1].disabled).toBe(false);
    });
  });
});

/**
 * When the SDK cannot produce an access token, the Auth0 interceptor fails the request with a
 * plain Error rather than an HttpErrorResponse, so there is no status to show.
 */
describe('Home without an access token', () => {
  it('says no token instead of inventing a status', async () => {
    const tokenError = new Error("Missing Refresh Token (audience: 'https://api.np-aspire.com')");
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideHttpClient(withInterceptors([() => throwError(() => tokenError)]))],
    }).compileComponents();

    const fixture = TestBed.createComponent(Home);
    await fixture.whenStable();
    buttons(fixture)[1].click();
    await fixture.whenStable();

    expect(resultText(fixture)).toBe("No token — Missing Refresh Token (audience: 'https://api.np-aspire.com')");
    expect(
      (fixture.nativeElement as HTMLElement).querySelector('[data-testid="api-check-result"]')?.classList,
    ).toContain('text-destructive');
  });

  it('describes a rejection that is not an Error at all', async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideHttpClient(withInterceptors([() => throwError(() => 'no token for you')]))],
    }).compileComponents();

    const fixture = TestBed.createComponent(Home);
    await fixture.whenStable();
    buttons(fixture)[1].click();
    await fixture.whenStable();

    expect(resultText(fixture)).toBe('No token — no token for you');
  });
});

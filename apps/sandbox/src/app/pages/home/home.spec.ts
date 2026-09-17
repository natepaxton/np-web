import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Home } from './home';

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

  afterEach(() => http?.verify());

  function buttons(fixture: ComponentFixture<Home>): HTMLButtonElement[] {
    return Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('button'));
  }

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

      const request = http.expectOne('/api/v1/auth/check');
      expect(request.request.method).toBe('GET');
      request.flush('authenticated', { status: 200, statusText: 'OK' });
      await fixture.whenStable();

      const result = (fixture.nativeElement as HTMLElement).querySelector('[data-testid="api-check-result"]');
      expect(result?.textContent).toContain('200');
      expect(result?.textContent).toContain('authenticated');
      expect(result?.classList).not.toContain('text-destructive');
    });

    it('reports the status when the API refuses the call', async () => {
      const fixture = await render();
      buttons(fixture)[1].click();

      http.expectOne('/api/v1/auth/check').flush('', { status: 403, statusText: 'Forbidden' });
      await fixture.whenStable();

      const result = (fixture.nativeElement as HTMLElement).querySelector('[data-testid="api-check-result"]');
      expect(result?.textContent).toContain('403');
      expect(result?.textContent).toContain('Forbidden');
      expect(result?.classList).toContain('text-destructive');
    });

    it('disables the button while the call is in flight', async () => {
      const fixture = await render();
      buttons(fixture)[1].click();
      await fixture.whenStable();

      expect(buttons(fixture)[1].disabled).toBe(true);
      expect(buttons(fixture)[1].textContent?.trim()).toBe('Calling…');

      http.expectOne('/api/v1/auth/check').flush('ok');
      await fixture.whenStable();
      expect(buttons(fixture)[1].disabled).toBe(false);
    });
  });
});

import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthService, User } from '@auth0/auth0-angular';
import { BehaviorSubject } from 'rxjs';
import { App } from './app';

describe('App', () => {
  let isLoading$: BehaviorSubject<boolean>;
  let isAuthenticated$: BehaviorSubject<boolean>;
  let user$: BehaviorSubject<User | null>;
  let auth: { loginWithRedirect: jest.Mock; logout: jest.Mock };

  beforeEach(async () => {
    isLoading$ = new BehaviorSubject(false);
    isAuthenticated$ = new BehaviorSubject(false);
    user$ = new BehaviorSubject<User | null>(null);
    auth = { loginWithRedirect: jest.fn(), logout: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: { isLoading$, isAuthenticated$, user$, ...auth } },
      ],
    }).compileComponents();
  });

  async function render(): Promise<HTMLElement> {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders the shell with navigation', async () => {
    const el = await render();
    expect(el.querySelector('[data-testid="app-name"]')?.textContent).toContain('sandbox');
    expect(Array.from(el.querySelectorAll('nav a')).map((a) => a.textContent?.trim())).toEqual(['Home', 'Profile']);
  });

  it('waits for the session check before offering auth actions', async () => {
    isLoading$.next(true);
    const el = await render();
    expect(el.querySelector('[data-testid="auth-status"]')?.textContent).toContain('Checking session');
    expect(el.querySelector('button')).toBeNull();
  });

  it('offers log in and sign up when signed out', async () => {
    const el = await render();
    const buttons = Array.from(el.querySelectorAll<HTMLButtonElement>('[data-testid="auth-status"] button'));
    expect(buttons.map((b) => b.textContent?.trim())).toEqual(['Log in', 'Sign up']);

    buttons[0].click();
    expect(auth.loginWithRedirect).toHaveBeenCalledWith();

    buttons[1].click();
    expect(auth.loginWithRedirect).toHaveBeenCalledWith({ authorizationParams: { screen_hint: 'signup' } });
  });

  it('shows the signed-in user and logs out', async () => {
    isAuthenticated$.next(true);
    user$.next({ email: 'ada@example.com' });
    const el = await render();

    expect(el.querySelector('[data-testid="auth-user"]')?.textContent?.trim()).toBe('ada@example.com');

    el.querySelector<HTMLButtonElement>('[data-testid="auth-status"] button')?.click();
    expect(auth.logout).toHaveBeenCalledWith({ logoutParams: { returnTo: window.location.origin } });
  });
});

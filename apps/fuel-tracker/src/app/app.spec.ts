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

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('shows loading state while checking auth', async () => {
    isLoading$.next(true);
    const el = await render();
    expect(el.querySelector('.auth-loading')).toBeTruthy();
    expect(el.textContent).toContain('Checking authentication');
  });

  it('shows login screen when not authenticated', async () => {
    const el = await render();
    expect(el.querySelector('.auth-login')).toBeTruthy();
    expect(el.querySelector('.login-card h1')?.textContent).toContain('Yellowstone Road Trip');

    el.querySelector<HTMLButtonElement>('.login-button')?.click();
    expect(auth.loginWithRedirect).toHaveBeenCalled();
  });

  it('shows app shell with router outlet when authenticated', async () => {
    isAuthenticated$.next(true);
    user$.next({ email: 'test@example.com' });
    const el = await render();

    expect(el.querySelector('.app-shell')).toBeTruthy();
    expect(el.querySelector('router-outlet')).toBeTruthy();
    expect(el.querySelector('.user-email')?.textContent).toBe('test@example.com');
  });

  it('logs out when sign out button is clicked', async () => {
    isAuthenticated$.next(true);
    user$.next({ email: 'test@example.com' });
    const el = await render();

    el.querySelector<HTMLButtonElement>('.logout-button')?.click();
    expect(auth.logout).toHaveBeenCalledWith({ logoutParams: { returnTo: window.location.origin } });
  });
});

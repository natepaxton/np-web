import { TestBed } from '@angular/core/testing';
import { AuthService, User } from '@auth0/auth0-angular';
import { BehaviorSubject } from 'rxjs';
import { Profile } from './profile';

describe('Profile', () => {
  let isLoading$: BehaviorSubject<boolean>;
  let user$: BehaviorSubject<User | null>;
  let error$: BehaviorSubject<Error | null>;

  beforeEach(async () => {
    isLoading$ = new BehaviorSubject(false);
    user$ = new BehaviorSubject<User | null>(null);
    error$ = new BehaviorSubject<Error | null>(null);

    await TestBed.configureTestingModule({
      imports: [Profile],
      providers: [{ provide: AuthService, useValue: { isLoading$, user$, error$ } }],
    }).compileComponents();
  });

  async function render(): Promise<HTMLElement> {
    const fixture = TestBed.createComponent(Profile);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('waits for the session check', async () => {
    isLoading$.next(true);
    const el = await render();
    expect(el.querySelector('[data-testid="profile-loading"]')).not.toBeNull();
  });

  it('prompts to sign in when there is no user', async () => {
    const el = await render();
    expect(el.querySelector('[data-testid="profile-signed-out"]')?.textContent).toContain('Not signed in');
  });

  it('renders the user claims when signed in', async () => {
    user$.next({ email: 'ada@example.com' });
    const el = await render();
    expect(el.querySelector('[data-testid="profile-user"]')?.textContent).toContain('ada@example.com');
  });

  it('surfaces an Auth0 error', async () => {
    error$.next(new Error('login_required'));
    const el = await render();
    expect(el.querySelector('[data-testid="profile-error"]')?.textContent).toContain('login_required');
  });
});

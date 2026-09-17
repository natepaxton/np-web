import { APIRequestContext, expect, Page } from '@playwright/test';

/**
 * The dev-tenant test users, created by Terraform in np-aspire-api (`infra/auth0/test-users.tf`).
 * `test-norole` has no role on purpose: it proves the API denies an authenticated user who has
 * no permissions.
 */
export const testUsers = {
  member: 'test-member@np-aspire.test',
  admin: 'test-admin@np-aspire.test',
  norole: 'test-norole@np-aspire.test',
} as const;

/** Shared password for all three, from the GitHub secret or a local .env.local. */
export const testUserPassword = process.env['E2E_TEST_USER_PASSWORD'] ?? '';

/** Matches the submit button in both Universal Login experiences. */
const submitButton = /^(log ?in|continue)$/i;

/**
 * Signs in through Auth0 Universal Login and waits for the app to finish the callback.
 *
 * The tenant currently serves the Classic experience (the Lock widget), which labels its fields
 * "Email" and "Password". Role-based locators also cover the New experience, where the field is
 * "Email address", the button is "Continue", and the password may come on a second step.
 */
export async function logIn(page: Page, email: string): Promise<void> {
  await page.goto('/');
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.waitForURL(/auth0\.com/);

  await page.getByRole('textbox', { name: /email/i }).fill(email);

  const password = page.getByRole('textbox', { name: /password/i });
  if (!(await password.isVisible())) {
    await page.getByRole('button', { name: submitButton }).click();
    await password.waitFor();
  }
  await password.fill(testUserPassword);
  await page.getByRole('button', { name: submitButton }).click();

  await page.waitForURL((url) => !url.hostname.endsWith('auth0.com'));
  await expect(page.getByTestId('auth-user')).toHaveText(email);
}

/**
 * True when the API is answering through the dev-server proxy. A 401 is the right answer to an
 * anonymous call, so it also confirms the API's deny-by-default rule is in force.
 */
export async function apiIsReachable(request: APIRequestContext): Promise<boolean> {
  try {
    const response = await request.get('/api/v1/auth/check', { failOnStatusCode: false });
    return response.status() === 401;
  } catch {
    return false;
  }
}

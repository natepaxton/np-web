import { expect, test } from '@playwright/test';
import { apiIsReachable, logIn, testUserPassword, testUsers } from './support/auth';

/**
 * Signs in as each dev-tenant test user and calls the API's protected probe endpoint, proving the
 * whole chain end to end: Auth0 issues an access token for the API audience, the interceptor
 * attaches it to the relative `/api/*` call, and the API decides the outcome from the user's role.
 *
 * These run against the real Auth0 dev tenant, so they need E2E_TEST_USER_PASSWORD, and against a
 * real API, so they need the backend running (np-aspire-api: `dotnet run --project
 * src/NpAspire.AppHost`). They skip, rather than fail, when either is missing — CI has no backend
 * yet. Chromium only, to keep three real logins per run instead of nine.
 */
test.describe('API access by role', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'One browser is enough for real logins.');

  let apiUp = false;

  test.beforeAll(async ({ playwright, baseURL }) => {
    const request = await playwright.request.newContext({ baseURL });
    apiUp = await apiIsReachable(request);
    await request.dispose();
  });

  test.beforeEach(() => {
    test.skip(testUserPassword === '', 'Set E2E_TEST_USER_PASSWORD (see .env.local or the GitHub secret).');
    test.skip(!apiUp, 'The API is not running on http://localhost:5104.');
  });

  const cases = [
    { name: 'test-member', email: testUsers.member, status: '200' },
    { name: 'test-admin', email: testUsers.admin, status: '200' },
    { name: 'test-norole', email: testUsers.norole, status: '403' },
  ];

  for (const { name, email, status } of cases) {
    test(`${name} gets ${status} from the auth check`, async ({ page }) => {
      await logIn(page, email);

      await page.getByRole('button', { name: 'Call endpoint' }).click();

      await expect(page.getByTestId('api-check-result')).toContainText(status);
    });
  }
});

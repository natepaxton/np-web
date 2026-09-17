import { expect, test } from '@playwright/test';
import { apiIsReachable, logIn, testUserPassword, testUsers } from './support/auth';

/**
 * Signs in as each dev-tenant test user and calls the API's protected probe endpoint, proving the
 * whole chain end to end: Auth0 issues an access token for the API audience, the interceptor
 * attaches it to the relative `/api/*` call, and the API accepts it.
 *
 * All three users get 200, including `test-norole`. `GET /api/v1/auth/check` is plain `[Authorize]`
 * — it asks for a valid token, not for a permission — so having no role is not yet visible here.
 * Telling the roles apart needs an endpoint behind a permission policy. When np-aspire-api serves
 * one (`GET /api/v1/users/me` is the first planned), add a case here expecting 403 for
 * `test-norole` and 200 for the other two.
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

  const users = [
    { name: 'test-member', email: testUsers.member },
    { name: 'test-admin', email: testUsers.admin },
    { name: 'test-norole', email: testUsers.norole },
  ];

  for (const { name, email } of users) {
    test(`${name} reaches the protected endpoint`, async ({ page }) => {
      await logIn(page, email);

      await page.getByRole('button', { name: 'Call endpoint' }).click();

      await expect(page.getByTestId('api-check-result')).toContainText('200');
    });
  }
});

import { test, expect } from '@playwright/test';

test('shows login screen for unauthenticated users', async ({ page }) => {
  await page.goto('/');

  // Wait for Auth0 SDK to finish checking authentication (loading spinner disappears)
  await expect(page.locator('.auth-loading')).toBeHidden({ timeout: 15000 });

  // Unauthenticated users should see the login screen
  await expect(page.locator('.login-card h1')).toHaveText('Yellowstone Road Trip');
  await expect(page.locator('.login-card p')).toHaveText('Sign in to view the fuel tracker dashboard');
  await expect(page.locator('.login-button')).toBeVisible();
});

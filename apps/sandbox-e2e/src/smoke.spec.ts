import { expect, test } from '@playwright/test';

test.describe('sandbox smoke', () => {
  test('renders the shell and shared ui panel', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByTestId('app-name')).toContainText('sandbox');
    await expect(page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'UI check' })).toBeVisible();
  });

  test('applies the Spartan theme', async ({ page }) => {
    await page.goto('/');

    const button = page.getByRole('button', { name: 'Greet' });
    const background = await button.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(background).not.toBe('rgba(0, 0, 0, 0)');
  });

  test('greets the entered name', async ({ page }) => {
    await page.goto('/');

    await page.getByLabel('Name').fill('Ada');
    await page.getByRole('button', { name: 'Greet' }).click();
    await expect(page.getByTestId('greeting')).toHaveText('Hello, Ada!');
  });
});

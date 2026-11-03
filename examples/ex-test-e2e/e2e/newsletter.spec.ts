import { expect, test } from '@playwright/test';

test.describe('Newsletter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('shows the form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Newsletter' })).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
  });

  // TODO: An invalid address shows the error message (role "alert").

  // TODO: A valid address shows the confirmation (role "status") with exactly this address.
});

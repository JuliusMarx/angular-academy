import { expect, test } from '@playwright/test';

test.describe('Newsletter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('shows the form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Newsletter' })).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
  });

  test('rejects an invalid address', async ({ page }) => {
    await page.getByLabel('Email').fill('jane.example.com');
    await page.getByRole('button', { name: 'Subscribe' }).click();

    await expect(page.getByRole('alert')).toHaveText('Please enter a valid email address.');
    await expect(page.getByRole('status')).toBeHidden();
  });

  test('confirms a valid address', async ({ page }) => {
    await page.getByLabel('Email').fill('jane@example.com');
    await page.getByRole('button', { name: 'Subscribe' }).click();

    await expect(page.getByRole('status')).toHaveText('Thanks! We sent a confirmation to jane@example.com.');
    await expect(page.getByRole('alert')).toBeHidden();
  });
});

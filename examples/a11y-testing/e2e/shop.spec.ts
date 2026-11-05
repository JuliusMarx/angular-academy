import { expect, test } from '@playwright/test';

// getByRole() finds elements by role and accessible name – like a screen reader does.
// If a test can't find a button this way, a screen reader user can't either.
test.describe('Shop', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has a heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Shop', level: 1 })).toBeVisible();
  });

  test('announces what was added', async ({ page }) => {
    await page.getByRole('button', { name: 'Add Mug to cart' }).click();

    await expect(page.getByRole('status')).toHaveText('Mug added to cart');
  });

  test('disables products that are out of stock', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Add Lamp to cart' })).toBeDisabled();
  });

  test('the filter reports its state', async ({ page }) => {
    const filter = page.getByRole('button', { name: 'Only in stock' });
    await expect(filter).toHaveAttribute('aria-pressed', 'false');

    await filter.click();

    await expect(filter).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByRole('listitem')).toHaveCount(2);
  });
});

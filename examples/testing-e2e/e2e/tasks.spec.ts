import { expect, test } from '@playwright/test';

test.describe('Tasks', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('starts empty', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Tasks' })).toBeVisible();
    await expect(page.getByText('Nothing to do')).toBeVisible();
    await expect(page.getByRole('listitem')).toHaveCount(0);
  });

  test('adds a task', async ({ page }) => {
    await page.getByLabel('New task').fill('Buy milk');
    await page.getByRole('button', { name: 'Add' }).click();

    await expect(page.getByRole('listitem')).toHaveText(['Buy milk']);
    await expect(page.getByLabel('New task')).toHaveValue('');
    await expect(page.getByRole('status')).toHaveText('1 open');
  });

  test('completes a task', async ({ page }) => {
    const input = page.getByLabel('New task');
    await input.fill('Buy milk');
    await input.press('Enter');
    await input.fill('Walk the dog');
    await input.press('Enter');

    await page.getByRole('checkbox', { name: 'Walk the dog' }).check();

    await expect(page.getByRole('checkbox', { name: 'Walk the dog' })).toBeChecked();
    await expect(page.getByRole('status')).toHaveText('1 open');
  });
});

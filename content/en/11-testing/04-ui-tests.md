---
title: UI tests with Playwright
minutes: 10
quiz:
  - question: What sets a UI test (end-to-end test) apart from a component test?
    options:
      - It is faster
      - It starts the whole app in a real browser and uses it like a user
      - It only tests the CSS
      - It doesn't need Angular
    answer: 1
  - question: "Why is `await page.waitForTimeout(2000)` before an assertion a bad idea?"
    options:
      - The function doesn't exist
      - Fixed waits make tests slow and still unreliable – Playwright waits automatically anyway
      - Two seconds are too short
      - It stops the server
    answer: 1
  - question: Which locator is the most robust?
    options:
      - "`page.locator('div > div:nth-child(3) button')`"
      - "`page.getByRole('button', { name: 'Subscribe' })`"
      - "`page.locator('.btn-primary')`"
      - "`page.locator('#button-17')`"
    answer: 1
    explanation: "`getByRole()` searches the way users and screen readers see the page. The test doesn't break when the structure or CSS classes change, and it checks accessibility along the way."
exercise:
  example: ex-test-e2e
  title: UI tests for a newsletter sign-up
  task: |-
    Write two more tests in `e2e/newsletter.spec.ts`:

    1. An invalid address (e.g. `jane.example.com`) shows the error message (role `alert`) after **Subscribe**.
    2. A valid address shows the confirmation (role `status`) with exactly this address.

    Your tests also run against broken versions of the app. A test should notice each of them.
  checks:
    tests-pass: Your tests pass against the real app
    catches-validation-bug: A test notices when invalid addresses are accepted
    catches-confirmation-bug: A test notices when no confirmation appears
    catches-address-bug: A test notices when the confirmation shows the wrong address
---

# UI tests with Playwright

Unit and component tests check individual parts. They don't show whether the app works as a whole: Is the routing wired up correctly? Does the click really reach the server? That's what **UI tests** check, also called **end-to-end tests** (E2E). They start the finished app in a real browser and use it like a user: open the page, fill in a field, click, read the result.

| Kind | Checks | Speed | Number |
|---|---|---|---|
| Unit test | a function or a service | milliseconds | many |
| Component test | a component with its template | milliseconds | some |
| UI test | the whole app in the browser | seconds | few, for the most important flows |

## Setting up Playwright

The most widely used tool for this is **Playwright**. It drives Chromium, Firefox and WebKit (Safari). You set it up in the project folder with:

```bash
npm init playwright@latest
```

This creates a `playwright.config.ts` and a folder for the tests. The configuration says how Playwright starts the app and at which address it runs:

```ts
export default defineConfig({
  testDir: './e2e',
  use: { baseURL: 'http://localhost:4200' },
  webServer: { command: 'npm run start', url: 'http://localhost:4200' },
});
```

`npx playwright test` then starts the dev server, runs all tests in all browsers and stops the server again.

> [!NOTE]
> `ng e2e` also offers to set up an E2E tool the first time you run it, for example Playwright or Cypress.

## A first test

```ts
import { expect, test } from '@playwright/test';

test('adds a task', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('New task').fill('Buy milk');
  await page.getByRole('button', { name: 'Add' }).click();

  await expect(page.getByRole('listitem')).toHaveText(['Buy milk']);
});
```

- `page` is a fresh browser tab, a new one for every test. So tests don't affect each other.
- `goto('/')` opens the app. The path is appended to the `baseURL`.
- Every action returns a promise and needs an `await`.

## Finding elements like a user

**Locators** describe how Playwright finds an element. Ideally the way a person would describe it:

| Locator | Finds |
|---|---|
| `getByRole('button', { name: 'Add' })` | elements by role and label, e.g. buttons, links, headings |
| `getByLabel('Email')` | form fields by their label |
| `getByText('Nothing to do')` | elements with this text |
| `getByPlaceholder('Search')` | fields by their placeholder |
| `getByTestId('cart')` | elements with `data-testid="cart"`, when nothing else fits |

A locator only searches when you use it, and searches again every time. So you can put it into a variable once and use it several times. With `first()`, `nth(1)` and `filter({ hasText: '…' })` you narrow down the matches.

> [!TIP]
> `getByRole()` and `getByLabel()` are the best choice. They don't break when CSS classes or the nesting change, and they only find an element if it is labeled correctly for screen readers too. Good UI tests check accessibility along the way.

## Automatic waiting

An app loads data, re-renders, shows animations. That's why Playwright waits **automatically**:

- Before an action like `click()`, it waits until the element exists, is visible and is enabled.
- Assertions with `await expect(locator)` check again and again until the condition is met, by default for up to 5 seconds.

```ts
await expect(page.getByRole('status')).toHaveText('1 open');      // whole text
await expect(page.getByRole('status')).toContainText('open');     // part of the text
await expect(page.getByRole('listitem')).toHaveCount(2);
await expect(page.getByRole('alert')).toBeHidden();
await expect(page).toHaveURL('/products');
```

> [!WARNING]
> Two typical mistakes make tests unreliable ("flaky"): fixed waits like `page.waitForTimeout(2000)` and checks like `expect(await locator.textContent()).toBe('…')`. The second one reads the text exactly once and doesn't wait. Always use `await expect(locator).toHaveText(…)`.

::tryit{testing-e2e}

> [!NOTE]
> The preview can't start a real browser. A small imitation of Playwright runs the same tests and drives the app in a frame below the results. It knows the most important locators, actions and assertions and only waits 1.5 instead of 5 seconds.

## Replacing the server

UI tests usually talk to the real backend. For error cases or fixed test data, you can intercept requests and answer them yourself:

```ts
test('shows an error when loading fails', async ({ page }) => {
  await page.route('**/api/products', (route) => route.fulfill({ status: 500 }));
  await page.goto('/products');
  await expect(page.getByRole('alert')).toHaveText('Could not load products.');
});
```

## Helpful tools

- `npx playwright test --ui` opens **UI mode**: run tests one by one and look at every step with a screenshot.
- `npx playwright codegen localhost:4200` opens a browser and records your clicks as test code.
- `npx playwright show-report` shows the report of the last run, with errors and *traces* of failed tests.

> [!TIP]
> Use UI tests for the most important paths through the app: signing in, searching, ordering. Special cases like every single validation rule are faster to check in unit and component tests.

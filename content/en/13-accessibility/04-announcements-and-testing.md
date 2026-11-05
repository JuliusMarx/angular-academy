---
title: Announcing changes and testing
minutes: 10
summary: |-
  - If something changes without the focus moving there ("Added to cart"), a screen reader only learns about it through a **live region**.
  - `role="status"` (or `aria-live="polite"`) waits until the screen reader is done. `role="alert"` (`aria-live="assertive"`) interrupts – only for urgent things.
  - The live region must already be in the DOM before its content changes. Don't show it with `@if` only when needed.
  - `LiveAnnouncer` from `@angular/cdk/a11y` announces texts without a region in your template: `announce('Saved')`.
  - Check automatically: axe as a browser extension, Lighthouse, `@axe-core/playwright` in UI tests, angular-eslint rules for templates.
  - Tests with `getByRole()` (Playwright, Testing Library) find elements the way a screen reader does. If the test can't find a button, a screen reader user can't either.
  - Automated tests only find some of the problems. Also test with the keyboard and a screen reader.

  ```html
  <button type="button" (click)="add(product)">Add to cart</button>
  <p role="status">{{ message() }}</p>
  ```
quiz:
  - question: "Why is the message in `@if (saved()) { <p role=\"status\">Saved</p> }` often not read out?"
    options:
      - "`role=\"status\"` only works with `aria-live=\"off\"`"
      - Screen readers never read out paragraphs
      - "`@if` is invisible to screen readers"
      - The live region is created together with its text – but screen readers only report changes in regions they already know
    answer: 3
    explanation: "Keep the region in the DOM all the time and only change its content: `<p role=\"status\">{{ message() }}</p>`."
  - question: When is `aria-live="assertive"` or `role="alert"` appropriate?
    options:
      - For every message, so it surely gets through
      - Only for urgent messages, like an error that needs attention right away
      - For loading indicators
      - Never, it's outdated
    answer: 1
  - question: "A test with `getByRole('button', { name: 'Save' })` doesn't find the button. What is the most likely cause?"
    options:
      - Playwright doesn't support buttons
      - The test runs too fast
      - The "button" is a `<div>` without a role, or its name is different
      - "`getByRole()` only searches for ids"
    answer: 2
    explanation: "`getByRole()` searches the accessibility tree. A `<div>` with `(click)` has no role `button` there – it is just as invisible to screen readers."
---

# Announcing changes and testing

Sighted users notice when "Added to cart" flashes up somewhere. A screen reader, however, only reads where the focus is. It only learns about changes elsewhere if you **announce** them.

## Live regions

A **live region** is an area whose changes the screen reader reads out by itself:

```html
<button type="button" (click)="add(product)">Add to cart</button>
<p role="status">{{ message() }}</p>
```

| Variant | Behavior | Use for |
|---|---|---|
| `role="status"` / `aria-live="polite"` | waits until the screen reader is done | confirmations, search results, "Saved" |
| `role="alert"` / `aria-live="assertive"` | interrupts immediately | urgent errors |

Use `polite` almost always. A message that keeps interrupting is annoying and distracting.

> [!WARNING]
> The region must be in the DOM **before** the change. If it appears with `@if` together with its text, it is often not read out. Keep the element and only change its content.

`aria-atomic="true"` makes sure the whole content is always read, not just the part that changed. That's useful for texts like "3 items in your cart".

## LiveAnnouncer from the CDK

Sometimes there's no good place for a region in the template, for example in a service. That's where `LiveAnnouncer` from `@angular/cdk/a11y` helps. It creates an invisible live region itself and puts the text into it:

```ts
import { LiveAnnouncer } from '@angular/cdk/a11y';

export class Cart {
  private readonly announcer = inject(LiveAnnouncer);

  add(product: Product): void {
    // …
    this.announcer.announce(`${product.name} is in your cart`);
  }
}
```

`announce()` optionally takes the politeness (`'polite'` is the default, or `'assertive'`) and a duration in milliseconds after which the message is removed again.

> [!NOTE]
> Content from a `@defer` block is not announced automatically. If loading should be audible, wrap the block in a live region.

## Automated checks with axe

**axe** by Deque is the most widely used tool for automated checks. It finds missing labels, too little contrast, broken ARIA references and much more.

- **In the browser:** the *axe DevTools* extension, or Lighthouse in the Chrome DevTools (Lighthouse uses axe internally).
- **In UI tests:** `@axe-core/playwright` checks the page in a real browser:

```ts
import AxeBuilder from '@axe-core/playwright';

test('has no detectable a11y issues', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  expect(results.violations).toEqual([]);
});
```

- **In the editor:** angular-eslint has rules for templates, e.g. `alt-text`, `label-has-associated-control`, `click-events-have-key-events` or `interactive-supports-focus`. You turn them on with `angular.configs.templateAccessibility` in `eslint.config.js`.

> [!WARNING]
> Automated tools only find some of the problems. No tool notices whether an `alt` text makes sense or whether the focus order is logical. Also test yourself: once with the keyboard only, once with a screen reader (NVDA on Windows, VoiceOver on macOS and iOS, TalkBack on Android).

## Testing with roles

Tests that find elements by **role and name** check accessibility along the way. You've already seen this with Playwright in the Testing chapter:

```ts
await page.getByRole('button', { name: 'Add Mug to cart' }).click();
await expect(page.getByRole('status')).toHaveText('Mug added to cart');
```

If the button is a `<div>`, `getByRole('button')` doesn't find it – the test fails, just like using it with a screen reader would.

The same principle exists for component tests with the **Angular Testing Library** (`@testing-library/angular`):

```ts
import { fireEvent, render, screen } from '@testing-library/angular';

it('adds a product to the cart', async () => {
  await render(ProductList);
  fireEvent.click(screen.getByRole('button', { name: 'Add Mug to cart' }));
  expect(screen.getByRole('status').textContent).toContain('Mug added to cart');
});
```

`render()` creates the component with `TestBed`, and `screen` searches the rendered DOM. The Angular Testing Library's `fireEvent` also updates the view right after the event.

In the example, UI tests with `getByRole()` run against a small shop page. Turn a button into a `<div>` and see which test fails.

::tryit{a11y-testing}

## You made it!

You now know the most important building blocks of Angular: components and templates, signals, component communication, directives and pipes, services and DI, routing, forms, HTTP, RxJS, testing, the advanced topics and accessibility.

The best next step is a project of your own. Start with `ng new`, pick a small idea and build it piece by piece. Whenever you get stuck, the search (<kbd>Ctrl</kbd>+<kbd>K</kbd>) takes you back to any lesson.

---
title: Semantic HTML
minutes: 9
summary: |-
  - Accessible apps work with a keyboard, screen readers, voice control and zoom. The benchmark is WCAG 2.2, level AA.
  - From your HTML the browser builds the **accessibility tree**: role, name and state of every element. Screen readers only read this tree.
  - Native elements first: `<button>` for actions, `<a href>` or `routerLink` for navigation. A `<div (click)>` can neither be focused nor used with the keyboard.
  - Every form field needs a `<label>`. A placeholder is not a label.
  - Headings form an outline without gaps. Landmarks like `<header>`, `<nav>`, `<main>` and `<footer>` help people jump around.
  - Images need `alt`, decorative images `alt=""`.
  - If there is a DOM property, bind it directly (`[disabled]`). Bind ARIA attributes with `[attr.aria-…]`. `null` removes the attribute.

  ```html
  <label for="email">Email</label>
  <input id="email" type="email" />
  <button type="button" [disabled]="!email()" (click)="subscribe()">Subscribe</button>
  ```
quiz:
  - question: "A button should trigger an action. What is the best solution?"
    options:
      - "`<div (click)=\"save()\">Save</div>`"
      - "`<div role=\"button\" (click)=\"save()\">Save</div>`"
      - "`<button type=\"button\" (click)=\"save()\">Save</button>`"
      - "`<span tabindex=\"0\" (click)=\"save()\">Save</span>`"
    answer: 2
    explanation: "A native `<button>` can be focused, reacts to Enter and Space and has the role `button`. With anything else you have to rebuild all that yourself – and it's easy to forget something."
  - question: Why is a placeholder not enough to label a field?
    options:
      - It disappears while typing and is not reliably read out as the field's name
      - Angular doesn't support placeholders
      - Placeholders are only allowed in forms with `FormsModule`
      - It is enough, a label is just decoration
    answer: 0
  - question: "How do you set the attribute `aria-current` depending on a signal in Angular?"
    options:
      - "`[aria-current]` doesn't work, you can't bind ARIA"
      - "`aria-current=\"{{ active() }}\"` is the only way"
      - "`[ariaCurrentAttr]=\"active()\"`"
      - "`[attr.aria-current]=\"active() ? 'page' : null\"`"
    answer: 3
    explanation: "With `attr.`, Angular writes an HTML attribute. If the value is `null`, Angular removes the attribute again."
---

# Semantic HTML

Accessibility (short: *a11y*) means everyone can use your app. Including people who only use the keyboard, listen to a screen reader, control the page by voice or zoom in a lot. That's more people than you might think – and since June 2025 the European Accessibility Act makes it mandatory for many online shops and services.

The benchmark is the **WCAG** (Web Content Accessibility Guidelines), currently version 2.2. Level **AA** is the usual target.

## The accessibility tree

Next to the DOM, the browser builds a second tree from your HTML: the **accessibility tree**. For every element it contains:

| Property | Example |
|---|---|
| Role | `button`, `link`, `heading`, `textbox` |
| Name | "Save", "Email" |
| State | disabled, expanded, selected |

Screen readers only read this tree. They don't care what something looks like. A `<div>` styled like a button is just text to them.

> [!TIP]
> You can see the tree in the Chrome DevTools: Elements → **Accessibility** tab. Firefox has its own **Accessibility** panel.

## Native elements first

The most important rule: use the HTML element that does exactly what you need.

```html
<!-- bad -->
<div class="button" (click)="save()">Save</div>

<!-- good -->
<button type="button" (click)="save()">Save</button>
```

The `<div>` gets no focus, doesn't react to Enter or Space and has no role. The `<button>` does all of that by itself. Angular calls `(click)` even when someone triggers the button with the keyboard.

- **Action** on the page (save, open, delete) → `<button type="button">`.
- **Navigation** to another page → `<a href>` or `<a routerLink>`.
- **Input** → `<input>`, `<select>`, `<textarea>` with a label.

> [!NOTE]
> Inside a `<form>`, a button without `type` is a submit button. Add `type="button"` if it should only do something and not submit.

## Labels for form fields

Every field needs a visible name that is linked to the field:

```html
<label for="email">Email</label>
<input id="email" type="email" />

<!-- or: the field sits inside the label -->
<label>
  <input type="checkbox" /> Subscribe to the newsletter
</label>
```

Clicking the label then also focuses the field. A `placeholder` is no replacement: it disappears while typing, often has too little contrast and is not reliably read out as the name.

## Headings and landmarks

Screen reader users often jump from heading to heading. That's why headings should form an outline:

- One `<h1>` per page, below it `<h2>`, `<h3>` … without skipping levels.
- Choose the level by structure, not by font size. You set the size with CSS.

**Landmarks** split the page into regions you can jump to directly:

```html
<header>…logo, search…</header>
<nav aria-label="Main menu">…links…</nav>
<main>…the page's content…</main>
<footer>…legal notice…</footer>
```

There is one `<main>` per page. In an Angular app it usually sits in the `App` component around the `<router-outlet />`. If there are several `<nav>` elements, tell them apart with `aria-label`.

## Images

```html
<img [src]="product.image" [alt]="product.name" />
<img src="divider.svg" alt="" />
```

- An image with content gets an `alt` text that describes what the image says.
- A purely decorative image gets `alt=""`. Then the screen reader skips it. If `alt` is missing completely, it often reads out the file name.

## Bindings and accessibility

Native states are set with a property binding. The browser then reports them by itself:

```html
<button type="button" [disabled]="saving()">Save</button>
<input type="checkbox" [checked]="done()" />
```

A disabled button can no longer be focused, and the screen reader says "unavailable" or "dimmed".

For ARIA attributes there is usually no matching DOM property that works reliably. You bind them as attributes with `attr.`:

```html
<a routerLink="/cart" [attr.aria-current]="active() ? 'page' : null">Cart</a>
```

If the value is `null` or `undefined`, Angular removes the attribute. Since Angular 20.2 you may also leave out the `attr.` for ARIA attributes: `[aria-current]="…"`. But if a directive on the element has an input with that name, the input gets the value. With `attr.` it is always clear that you mean an attribute.

> [!TIP]
> For active links there is a ready-made solution: `routerLinkActive="active" ariaCurrentWhenActive="page"` sets `aria-current="page"` automatically.

## Try it

The example shows the same form twice. Click into the page and press <kbd>Tab</kbd> a few times: the `<div>` "button" is skipped, the real button is not.

::tryit{a11y-semantic}

> [!WARNING]
> `tabindex="0"` does make the `<div>` focusable, but Enter and Space still do nothing, and the role is missing. You would have to rebuild everything `<button>` already does. Use the native element right away.

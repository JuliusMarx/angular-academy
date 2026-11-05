---
title: ARIA in Angular
minutes: 10
summary: |-
  - ARIA adds role, name and state to the accessibility tree. It changes no behavior: `role="button"` makes an element neither focusable nor usable with the keyboard.
  - First rule: if there is a native element, use it. No ARIA is better than bad ARIA.
  - Bind states with `[attr.aria-expanded]`, `[attr.aria-pressed]`, `[attr.aria-invalid]`. `null` removes the attribute.
  - `aria-describedby` and `aria-controls` point to ids. Every instance of a component needs its own ids, e.g. from a counter.
  - In directives you set the role and ARIA attributes in the `host` object.
  - `@angular/aria` offers ready-made, unstyled directives for patterns like accordion, tabs or combobox – a developer preview in Angular 21, stable since Angular 22.

  ```ts
  let nextId = 0;

  @Component({
    selector: 'app-disclosure',
    template: `
      <button type="button" [attr.aria-expanded]="open()" [attr.aria-controls]="panelId" (click)="open.set(!open())">
        {{ label() }}
      </button>
      <div [id]="panelId" [hidden]="!open()"><ng-content /></div>
    `,
  })
  export class Disclosure {
    readonly label = input.required<string>();
    protected readonly open = signal(false);
    protected readonly panelId = `disclosure-${nextId++}`;
  }
  ```
quiz:
  - question: "What happens if you only give a `<div>` `role=\"button\"`?"
    options:
      - It now behaves exactly like a `<button>`
      - Screen readers call it a button, but it can neither be focused nor used with Enter or Space
      - Angular throws an error
      - It is automatically turned into a `<button>`
    answer: 1
    explanation: "ARIA only changes what's in the accessibility tree. You have to rebuild focus and keyboard support yourself. A role is a promise."
  - question: "A component sets `id=\"hint\"` and `aria-describedby=\"hint\"`. What goes wrong if it appears three times on the page?"
    options:
      - Nothing, ids may appear several times
      - Angular renames the ids automatically
      - The component can only be used once
      - The id exists three times – all fields point to the first hint
    answer: 3
    explanation: "ids must be unique on the page. Create one per instance, for example with a counter at module level."
  - question: How does a directive set `aria-pressed` on its host element?
    options:
      - "With `'[attr.aria-pressed]': 'pressed()'` in the `host` object"
      - "With `@HostListener('aria-pressed')`"
      - "With `document.querySelector()` in the constructor"
      - Not at all, only components can do that
    answer: 0
exercise:
  example: ex-a11y-faq
  title: An accessible FAQ
  task: |-
    The FAQ questions can only be opened with the mouse, and screen readers don't learn whether an answer is open. Rebuild `FaqItem` following the disclosure pattern:

    1. Replace the `<div>` with the `(click)` by a `<button type="button">`. It stays inside the `<h3>`.
    2. Bind `aria-expanded` to the signal `open`.
    3. Give every answer its own id (counter at module level) and link the button to it with `aria-controls`.
  checks:
    uses-button: "Every question is a `<button>` inside the `<h3>`"
    expanded-state: "`aria-expanded` switches between `false` and `true`, the answer appears and disappears"
    controls-panel: "`aria-controls` points to its own answer, every id exists only once"
---

# ARIA in Angular

Sometimes HTML is not enough. A button expands a section – but how does a screen reader know whether it is open right now? That's what **ARIA** (*Accessible Rich Internet Applications*) is for: attributes that add role, name and state to the accessibility tree.

## No ARIA is better than bad ARIA

ARIA only changes what the screen reader hears. It doesn't change behavior:

```html
<div role="button" (click)="save()">Save</div>
```

The screen reader now says "Save, button". But the element can't be focused and doesn't react to Enter. A role is a promise, and here it is broken. For users that is worse than no role at all.

That's why a few rules apply:

1. If there is a native element with that meaning, use it.
2. Don't change the meaning of native elements (no `<h2 role="button">`).
3. Everything with an interactive role must be usable with the keyboard.
4. Don't hide anything focusable with `aria-hidden="true"`.
5. Every interactive element needs a name.

## The most important attributes

| Attribute | Purpose |
|---|---|
| `aria-label` | Name when there is no visible text (e.g. icon button) |
| `aria-labelledby` | Name taken from another element (by id) |
| `aria-describedby` | Additional description, e.g. a hint or error (by id) |
| `aria-expanded` | Is the related section open? (`true`/`false`) |
| `aria-controls` | Which element does the button control? (by id) |
| `aria-pressed` | Is the toggle button pressed? (`true`/`false`) |
| `aria-invalid` | Is the input invalid? |
| `aria-hidden` | Hide an element from screen readers (e.g. decorative icons) |

Fixed values go straight into the template. Changing values are bound with `attr.`:

```html
<button type="button" aria-label="Close">✕</button>
<button type="button" [attr.aria-pressed]="muted()" (click)="toggleMute()">Mute</button>
```

Angular turns `true` and `false` into the texts `"true"` and `"false"`, exactly as ARIA expects them.

## Expanding and collapsing: the disclosure pattern

A button that shows and hides a section is called a **disclosure** in the ARIA guide. You need:

- a real `<button>` (brings focus, Enter and Space),
- `aria-expanded` with the current state,
- optionally `aria-controls` with the id of the section.

```ts
let nextId = 0;

@Component({
  selector: 'app-disclosure',
  template: `
    <button type="button" [attr.aria-expanded]="open()" [attr.aria-controls]="panelId" (click)="open.set(!open())">
      {{ label() }}
    </button>
    <div [id]="panelId" [hidden]="!open()">
      <ng-content />
    </div>
  `,
})
export class Disclosure {
  readonly label = input.required<string>();
  protected readonly open = signal(false);
  protected readonly panelId = `disclosure-${nextId++}`;
}
```

`[hidden]` hides the section but keeps it in the DOM. That way `aria-controls` always points to an existing element.

## Unique ids per instance

`aria-controls`, `aria-describedby` and `aria-labelledby` point to **ids**. If a component appears several times on the page, a fixed id would exist several times – and all references end up at the first element.

The solution from above: a counter **outside** the class. It exists once per module, and every new instance gets the next number (`disclosure-0`, `disclosure-1`, …).

The same goes for hints and errors on form fields:

```html
<label [for]="id">Password</label>
<input [id]="id" type="password" [attr.aria-describedby]="id + '-hint'" [attr.aria-invalid]="tooShort()" />
<p [id]="id + '-hint'">At least 8 characters.</p>
```

On focus the screen reader then reads "Password, At least 8 characters".

## ARIA in directives

A directive sets role and states through the `host` object. The example turns any button into a toggle button:

```ts
@Directive({
  selector: 'button[appToggle]',
  host: {
    '[attr.aria-pressed]': 'pressed()',
    '(click)': 'pressed.set(!pressed())',
  },
})
export class Toggle {
  readonly pressed = model(false);
}
```

The selector `button[appToggle]` makes sure the directive only sits on real buttons. Focus and keyboard support come from the browser.

::tryit{a11y-aria}

## Ready-made patterns: @angular/aria

Complex widgets like tabs, menus, comboboxes or tree views need much more: arrow keys, focus handling, the right roles. Building that yourself is a lot of work and easy to get wrong.

The package **`@angular/aria`** offers ready-made directives for this without any styling of their own (*headless*): Accordion, Combobox, Grid, Listbox, Menu, Tabs, Toolbar, Tree and more. They take care of keyboard, ARIA attributes and focus, you provide HTML and CSS. It was released as a **developer preview** with Angular 21 and is **stable** since Angular 22.

```bash
npm install @angular/aria
```

> [!NOTE]
> Before you build a widget yourself: check the W3C's [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/patterns/) (APG). For every pattern it lists the roles, attributes and keys you need.

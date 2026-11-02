---
title: Projecting content with ng-content
minutes: 8
quiz:
  - question: Where does projected content end up if it matches no select?
    options:
      - It is discarded
      - In the first ng-content with a select
      - In the ng-content without select (default slot)
      - At the end of the component
    answer: 2
  - question: Which component is responsible for styling projected content?
    options:
      - The component that contains the ng-content
      - The component in whose template the content is written
      - Only global styles
      - None – projected content can't be styled
    answer: 1
    explanation: Projected elements belong to the parent's template – so the parent's encapsulated styles apply.
  - question: When is the content inside <ng-content>…</ng-content> shown?
    options:
      - Always
      - Only when nothing was projected into this slot
      - Only in development mode
      - Never, it's just a comment
    answer: 1
exercise:
  example: ex-projection
  title: An alert with a title
  task: |-
    The alerts in `app.ts` pass content, but `Alert` doesn't show it yet.

    1. Project elements with the attribute `alert-title` into the title area. If there is none, show the fallback text **Note**.
    2. Project everything else into the body area.
  checks:
    title-slot: The first alert shows **Heads up!** in the title area
    body-slot: The text is in the body area – and the title is not repeated there
    fallback-title: The second alert shows the fallback title **Note**
---

# Projecting content with ng-content

With inputs you give a component **data**. Sometimes, though, you want to hand it whole **markup**: a card should provide a frame, a header and a footer – what goes inside is up to each usage. This is called **content projection**.

## A simple slot

```ts
@Component({
  selector: 'app-card',
  template: `
    <section class="card">
      <ng-content />
    </section>
  `,
})
export class Card {}
```

```html
<app-card>
  <h2>Welcome</h2>
  <p>Everything between the tags ends up in the ng-content.</p>
</app-card>
```

`<ng-content />` is a placeholder: Angular inserts everything that sits between `<app-card>` and `</app-card>`.

## Multiple slots with select

`select` decides which content goes into which slot. You can select by attribute, element or CSS class:

```html
<section>
  <header><ng-content select="[card-title]" /></header>
  <div class="body"><ng-content /></div>
  <footer><ng-content select="[card-footer]" /></footer>
</section>
```

```html
<app-card>
  <h2 card-title>Angular Academy</h2>
  <p>Goes into the default slot.</p>
  <button card-footer>Get started</button>
</app-card>
```

Anything that matches no `select` ends up in the `<ng-content />` **without** `select`.

## Fallback content

Whatever sits between `<ng-content>` and `</ng-content>` is shown when nothing was passed for that slot:

```html
<footer>
  <ng-content select="[card-footer]">
    <small>No actions</small>
  </ng-content>
</footer>
```

::tryit{content-projection}

## Who styles what?

Projected elements belong to the **parent's** template. That's why the parent's styles apply to them – not the card's:

```ts
@Component({
  selector: 'app-root',
  template: `<app-card><h2 card-title>…</h2></app-card>`,
  styles: `h2 { margin: 0; }`, // applies to the projected h2
})
export class App {}
```

The card styles its own frame: `section`, `header`, `footer`.

> [!WARNING]
> `<ng-content>` can't be rendered conditionally or repeatedly. An `<ng-content />` inside `@if` or `@for` shows the content at most once – and the content is always created, even when it isn't visible. For those cases, use templates with `ng-template`.

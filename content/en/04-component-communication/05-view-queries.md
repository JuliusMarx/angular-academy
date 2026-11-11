---
title: Querying Child Elements with viewChild()
minutes: 8
summary: |-
  - `viewChild('search')` accesses an element with `#search` in the component's own template and returns a signal.
  - For HTML elements you get an `ElementRef`, the DOM element is in `nativeElement`. With a component class you get the instance.
  - Without `.required` the value is `undefined` as long as the element doesn't exist.
  - `viewChildren()` returns all matches as a list and updates itself when `@for` changes entries.
  - For projected content there are `contentChild()` and `contentChildren()`.
  - Use queries sparingly – inputs, outputs and bindings are usually simpler.

  ```ts
  private readonly search = viewChild.required<ElementRef<HTMLInputElement>>('search');

  constructor() {
    afterNextRender(() => this.search().nativeElement.focus());
  }
  ```

  > [!WARNING] The query is only filled after rendering, in the constructor it's still empty. Access it in `afterNextRender()`, in event handlers or in an `effect()`.
quiz:
  - question: "What does viewChild('search') return for <input #search />?"
    options:
      - The text in the input
      - A signal holding an ElementRef to the input element
      - An observable
      - The input element directly, without a signal
    answer: 1
  - question: When is a view query filled?
    options:
      - Already in the constructor
      - Only after the view has been rendered
      - Only when you load it manually
      - Only in the template
    answer: 1
    explanation: Access it in `afterNextRender()`, in event handlers or in an `effect()`.
  - question: What is contentChild() for?
    options:
      - Elements in the component's own template
      - Elements projected into the component via ng-content
      - Child routes
      - Elements in another component on the page
    answer: 1
---

# Querying Child Elements with viewChild()

Most of the time, inputs, outputs and bindings are enough. Sometimes, though, the class needs direct access to an element or a child component: to focus an input, start a video or expand all entries of a list. That's what **view queries** are for.

## Querying an element

In the lesson on template variables you met `#name`. With `viewChild()` you access it from the class:

```ts
import { afterNextRender, Component, ElementRef, viewChild } from '@angular/core';

@Component({
  selector: 'app-search',
  template: `<input #search placeholder="Search …" />`,
})
export class Search {
  private readonly search = viewChild.required<ElementRef<HTMLInputElement>>('search');

  constructor() {
    afterNextRender(() => this.search().nativeElement.focus());
  }
}
```

- `viewChild()` returns a **signal**. Without `.required` the value is `undefined` while the element doesn't exist – for example inside an `@if` that is currently `false`.
- For an HTML element you get an `ElementRef`. The actual DOM element is in `nativeElement`.

> [!WARNING]
> The query is only filled **after the view has been rendered**. In the constructor it is still empty. Access it in `afterNextRender()`, in event handlers or in an `effect()`.

## Querying components

Instead of a name you can pass a component class. You then get the **instance** and can use its public properties and methods:

```ts
readonly player = viewChild.required(VideoPlayer);

play(): void {
  this.player().start();
}
```

## Multiple matches with viewChildren()

`viewChildren()` returns all matches as a list – and updates automatically when `@for` adds or removes entries:

```ts
protected readonly items = viewChildren(FaqItem);
protected readonly openCount = computed(() => this.items().filter((i) => i.open()).length);

expandAll(): void {
  for (const item of this.items()) item.open.set(true);
}
```

::tryit{view-queries}

> [!TIP]
> In the example, filter for "signal", expand all and clear the filter again: only one entry is still open. The hidden components were destroyed and created anew – and lost their state along the way.

## Projected content: contentChild()

`viewChild()` only finds elements in the component's **own template**. For content that comes in via `<ng-content>`, there are `contentChild()` and `contentChildren()`:

```ts
@Component({
  selector: 'app-tabs',
  template: `<ng-content />`,
})
export class Tabs {
  readonly tabs = contentChildren(Tab); // all <app-tab> between <app-tabs> and </app-tabs>
}
```

> [!NOTE]
> Use queries sparingly. If something can be solved with an input, an output or a binding, that is almost always easier to understand and to test.

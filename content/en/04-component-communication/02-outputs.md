---
title: Reporting events with output()
minutes: 7
quiz:
  - question: How does the child component trigger an output named rated?
    options: ["this.rated.set(5)", "this.rated(5)", "this.rated.emit(5)", "this.rated.next(5)"]
    answer: 2
  - question: What is the value an output emitted called in the template?
    options: ["$value", "$event", "$output", "event.detail"]
    answer: 1
    explanation: "For custom outputs, `$event` is the value from `emit()` – for DOM events like `(click)` it's the DOM event."
  - question: How do you bind to the output rated in the parent component?
    options: ['[rated]="onRated()"', '(rated)="onRated($event)"', '{{ rated }}', '[(rated)]="rating"']
    answer: 1
---

# Reporting events with output()

Inputs carry data downwards. For the way back – "the user gave 4 stars" – there are **outputs**. A child component uses them to report an event, and the parent reacts to it.

## Declaring and emitting an output

```ts
import { Component, output } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  template: `
    @for (star of [1, 2, 3, 4, 5]; track star) {
      <button (click)="rated.emit(star)">★</button>
    }
  `,
})
export class StarRating {
  readonly rated = output<number>();
}
```

- `output<number>()` defines which type is sent along when it fires.
- `emit(value)` fires the event.

## Reacting to an output

The parent binds the output with parentheses – just like `(click)`:

```html
<app-star-rating (rated)="onRated($event)" />
```

```ts
protected onRated(stars: number): void {
  this.rating.set(stars);
}
```

Here `$event` is the value sent with `emit()` – the number of stars.

## Events without a value

Sometimes it's enough to know *that* something happened:

```ts
readonly cleared = output<void>();

clear(): void {
  this.cleared.emit();
}
```

```html
<app-star-rating (cleared)="rating.set(null)" />
```

::tryit{component-outputs}

> [!TIP]
> Name outputs after **what happened** – `rated`, `closed`, `selected` – not after what the parent should do with it. That keeps the child component reusable.

> [!WARNING]
> Don't give an output a name that is also a DOM event, such as `click` or `change`. Otherwise the handler also fires for the native event that bubbles up out of the component.

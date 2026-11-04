---
title: Reporting events with output()
minutes: 7
summary: |-
  - With outputs, a child component reports an event to the parent component.
  - `output<number>()` defines the type, `emit(value)` triggers the event.
  - The parent component binds with parentheses: `(rated)="onRated($event)"`. `$event` is the value from `emit()`.
  - For events without a value there is `output<void>()` and `emit()` without an argument.
  - Name outputs after what happened (`rated`, `closed`, `selected`).

  ```ts
  readonly rated = output<number>();
  // in the child component's template:
  // <button (click)="rated.emit(star)">★</button>
  ```

  > [!WARNING] Don't give an output a name that also exists as a DOM event (`click`, `change`) – otherwise the handler also reacts to the native event.
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
exercise:
  example: ex-outputs
  title: Report likes upwards
  task: |-
    The like button counts its clicks, but the post never hears about them.

    1. Give `LikeButton` an output `liked` that sends the new number of likes.
    2. Emit it in `like()`.
    3. Listen to it in `app.ts` and store the value in `likes`.
  checks:
    parent-updates: After one click the post shows **1 likes**
    sends-count: After three clicks it shows **3 likes**
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

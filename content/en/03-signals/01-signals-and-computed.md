---
title: signal() and computed()
minutes: 10
summary: |-
  - `signal(0)` creates a signal, `count()` reads its value.
  - `set(5)` sets a new value, `update((n) => n + 1)` computes it from the old one.
  - Never change objects or arrays in place, copy them: `list.update((l) => [...l, item])`.
  - `computed()` derives values from other signals: read-only, cached, only recomputes when something changes.
  - In the template you read signals with `{{ count() }}`. Angular then updates exactly those places.

  ```ts
  protected readonly count = signal(0);
  protected readonly doubled = computed(() => this.count() * 2);

  protected increment(): void {
    this.count.update((n) => n + 1);
  }
  ```
quiz:
  - question: How do you change a signal's value based on its current value?
    options: ["count = count + 1", "count.set(count + 1)", "count.update(n => n + 1)", "count.mutate(n => n++)"]
    answer: 2
    explanation: "`update()` receives the current value and returns the new one."
  - question: What is true about a computed() signal?
    options:
      - You can overwrite it with set()
      - It is recalculated on every change detection run
      - It is only recalculated when one of the signals it reads has changed
      - It only works in templates
    answer: 2
    explanation: computed() is read-only, lazy and cached. It only recalculates when its dependencies change.
exercise:
  example: ex-signals-counter
  title: Square and reset
  task: |
    The counter in the starter project already works. Extend it:

    1. Create a `computed()` signal `squared` that calculates the square of `count`, and show it in an element with `id="squared"` – for example `<p id="squared">Squared: …</p>`.
    2. Add a button with the text **Reset** that sets the counter back to 0.
  checks:
    squared-shown: An element with `id="squared"` shows the square
    squared-updates: After clicking **+** three times it shows 9
    reset: "**Reset** sets counter and square back to 0"
---

# signal() and computed()

**Signals** are the heart of reactivity in Angular. A signal is a container for a value that automatically notifies Angular when the value changes. That way Angular knows exactly which parts of the UI need updating.

## Creating and reading a signal

```ts
import { signal } from '@angular/core';

const count = signal(0);

console.log(count()); // 0 – read by calling it
```

## Changing values

```ts
count.set(5);               // set the value directly
count.update((n) => n + 1); // compute the new value from the old one
```

> [!WARNING]
> Never modify objects or arrays inside a signal directly (e.g. with `push`). Create a new copy instead: `todos.update((list) => [...list, item])`. Only then does Angular notice the change.

## Derived values with computed()

`computed()` defines values that derive from other signals:

```ts
import { computed, signal } from '@angular/core';

const count = signal(3);
const doubled = computed(() => count() * 2);

console.log(doubled()); // 6
count.set(10);
console.log(doubled()); // 20
```

A `computed()` signal

- tracks **automatically** which signals it reads,
- is **read-only** (no `set()` or `update()`),
- only recalculates when a dependency has changed, and caches the result.

## Signals in components

```ts
@Component({
  selector: 'app-root',
  template: `
    <h1>Counter: {{ count() }}</h1>
    <p>Doubled: {{ doubled() }}</p>
    <button (click)="increment()">+</button>
  `,
})
export class App {
  protected readonly count = signal(0);
  protected readonly doubled = computed(() => this.count() * 2);

  protected increment(): void {
    this.count.update((n) => n + 1);
  }
}
```

::tryit{signals-counter}

> [!TIP]
> Add a `computed()` signal `squared` to the example that calculates the square of the counter, and display it in the template.

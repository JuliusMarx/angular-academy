---
title: Side effects with effect()
minutes: 8
quiz:
  - question: When does an effect() run again?
    options:
      - On every click on the page
      - When one of the signals it read during its last run changes
      - Only once at startup
      - Every second
    answer: 1
  - question: What is effect() meant for?
    options:
      - Calculating derived values
      - Keeping signals in sync with other signals
      - Reacting to changes with side effects, such as saving or logging
      - Caching HTTP requests
    answer: 2
    explanation: For derived values use `computed()`, for dependent writable state use `linkedSignal()`.
  - question: Where can effect() be called?
    options:
      - Anywhere, including plain functions
      - Only in templates
      - In an injection context, e.g. the constructor or a field initializer
      - Only in main.ts
    answer: 2
---

# Side effects with effect()

`computed()` calculates values. Sometimes, though, you want to **react** to a change – save a value, log something or update a library outside of Angular. That's what `effect()` is for.

## A first effect

```ts
import { Component, effect, signal } from '@angular/core';

@Component({ /* … */ })
export class Notes {
  protected readonly note = signal(localStorage.getItem('note') ?? '');

  constructor() {
    effect(() => {
      localStorage.setItem('note', this.note());
    });
  }
}
```

An effect

- runs **at least once**,
- remembers which signals it read,
- runs **again** when one of them changes.

Angular batches changes: if you set a signal three times in a row, the effect runs only once afterwards.

## Cleaning up with onCleanup

If an effect starts something that keeps running (timers, subscriptions), clean it up with `onCleanup`. The function is called before the effect runs again or when the component is destroyed:

```ts
effect((onCleanup) => {
  const text = this.note();
  const timer = setTimeout(() => console.log('Changed:', text), 300);
  onCleanup(() => clearTimeout(timer));
});
```

As a bonus, this gives you a simple *debounce*: the log only happens after 300 ms without typing.

## Where effect() is allowed

`effect()` needs an **injection context** – that is, the constructor or a field of a component or service. When the component is destroyed, Angular stops its effects automatically.

::tryit{signals-effect}

> [!WARNING]
> Don't use `effect()` to derive one signal from another. Instead of `effect(() => this.total.set(this.a() + this.b()))`, write `total = computed(() => this.a() + this.b())`. It's simpler, faster and avoids intermediate states.

> [!TIP]
> If an effect needs a signal's value without depending on it, read it with `untracked(() => this.user())`.

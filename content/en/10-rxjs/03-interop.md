---
title: Connecting signals and RxJS
minutes: 8
summary: |-
  - The package `@angular/core/rxjs-interop` connects signals and observables.
  - `toSignal(obs$)` turns an observable into a signal and unsubscribes by itself. Without `initialValue` it is `undefined` at first.
  - `toSignal()` needs an injection context: call it when initializing a field, not in a method.
  - `toObservable(signal)` turns a signal into an observable, so you can use time operators on signals. It emits asynchronously.
  - `rxResource()` is like `resource()`, except that `stream` returns an observable.
  - If you must subscribe yourself, `takeUntilDestroyed()` unsubscribes automatically (outside an injection context, pass `this.destroyRef`).

  ```ts
  protected readonly query = signal('');

  protected readonly results = toSignal(
    toObservable(this.query).pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((q) => this.countries.search(q)),
    ),
    { initialValue: [] },
  );
  ```
quiz:
  - question: "Why don't you need to unsubscribe yourself with `toSignal()`?"
    options:
      - Because signals have no subscriptions
      - Because `toSignal()` unsubscribes automatically when the component is destroyed
      - Because the observable only emits one value
      - You do have to unsubscribe
    answer: 1
  - question: How do you turn a signal into an observable?
    options: ["toSignal()", "toObservable()", "signal.pipe()", "of(signal)"]
    answer: 1
  - question: "Where can you call `toSignal()`?"
    options:
      - Anywhere
      - In an injection context, e.g. when initializing a field
      - Only in `ngOnInit`
      - Only in services
    answer: 1
    explanation: "`toSignal()` needs the surrounding `DestroyRef` to unsubscribe. Outside an injection context, pass an injector via the `injector` option."
exercise:
  example: ex-interop
  title: Live notifications
  task: |-
    The `Notifications` service delivers new messages as the observable `messages$`. Bring them into the component:

    1. `latest`: the latest message, with `toSignal()` (initial value `'No messages yet'`).
    2. `history`: all messages as a list, collected with `scan()` and converted with `toSignal()` (initial value `[]`).
    3. The filter should only apply after a 300 ms typing pause: make an observable from `keyword` with `toObservable()`, debounce it with `debounceTime(300)` and convert it back with `toSignal()`. Filter `history` with it, ignoring upper and lower case.
  checks:
    latest-message: The latest message appears under “Latest”
    message-history: All three messages are collected
    debounced-filter: The filter only applies after a typing pause
---

# Connecting signals and RxJS

In Angular, signals and observables work hand in hand. Templates, `computed()` and inputs speak signals. HTTP, events and timed flows often arrive as observables. The `@angular/core/rxjs-interop` package connects the two worlds.

## Observable → signal: toSignal

`toSignal()` subscribes to an observable and gives you a signal holding the latest value:

```ts
import { toSignal } from '@angular/core/rxjs-interop';

protected readonly now = toSignal(interval(1000).pipe(map(() => Date.now())), {
  initialValue: Date.now(),
});
```

- **No need to unsubscribe**: `toSignal()` unsubscribes when the component (or service) is destroyed.
- Without `initialValue`, the signal is `undefined` until the first value arrives. If the observable is guaranteed to emit its first value right away, say so with `{ requireSync: true }`.
- `toSignal()` needs an **injection context**. Call it when initializing a field, not inside a method.

## Signal → observable: toObservable

`toObservable()` goes the other way: every time the signal changes, a new value is emitted. That lets you apply RxJS time operators to signals:

```ts
protected readonly query = signal('');

protected readonly results = toSignal(
  toObservable(this.query).pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap((q) => this.countries.search(q)),
  ),
  { initialValue: [] },
);
```

Signal in, RxJS pipeline in the middle, signal out. This is a very common pattern.

::tryit{rxjs-interop}

> [!NOTE]
> `toObservable()` emits **asynchronously**, after Angular has processed the change. If you set a signal twice in a row, only the last value reaches the observable.

## rxResource

If all you care about is the result, `rxResource()` is even shorter. It is like `resource()` from the Signals chapter, except that the loader (`stream`) returns an observable:

```ts
protected readonly letter = signal('A');

protected readonly byLetter = rxResource({
  params: () => this.letter(),
  stream: ({ params }) => this.countries.startingWith(params),
});
```

You get the same signals as with `resource()`: `value()`, `isLoading()`, `error()` and `reload()`.

## takeUntilDestroyed

If you do need to subscribe yourself, for example to trigger an action on every value, `takeUntilDestroyed()` unsubscribes for you automatically:

```ts
constructor() {
  this.notifications.messages$
    .pipe(takeUntilDestroyed())
    .subscribe((message) => this.toast.show(message));
}
```

Without an argument it only works in an injection context, here the constructor. Elsewhere, pass the `DestroyRef`: `takeUntilDestroyed(this.destroyRef)`.

## Which one when?

| Task | Tool |
|---|---|
| Load data that depends on signals | `httpResource()` or `rxResource()` |
| Use an observable in the template or in `computed()` | `toSignal()` |
| Apply time operators to a signal | `toObservable()` + `toSignal()` |
| Run an action on every value | `subscribe()` with `takeUntilDestroyed()` |

> [!TIP]
> You'll often see the `async` pipe (`{{ data$ | async }}`) in older code. It subscribes in the template. In new code, `toSignal()` is usually the better choice, because you can then use the value in `computed()` and in code too.

---
title: Observables
minutes: 8
summary: |-
  - An observable delivers values over time: `next(value)` any number of times, then at most one `error()` or `complete()`.
  - It does nothing until someone calls `subscribe()`. The `$` at the end of the name is a convention for observables.
  - Usually you get observables ready-made: from `HttpClient`, `interval(1000)`, `of(1, 2, 3)` or `fromEvent()`.
  - `subscribe()` returns a `Subscription`, `unsubscribe()` ends it.
  - A `Subject` is an observable you push values into yourself. For state, use a signal today instead of a `BehaviorSubject`.
  - Signals for state ("what is true right now?"), observables for events over time ("what is happening?").

  ```ts
  start(): void {
    this.subscription = interval(1000).subscribe(() => this.seconds.update((s) => s + 1));
  }

  stop(): void {
    this.subscription?.unsubscribe();
  }
  ```

  > [!WARNING] Endless observables like `interval()`, events or subjects keep running even after the component is gone. Unsubscribe at the latest with `inject(DestroyRef).onDestroy(…)`, or you get a memory leak.
quiz:
  - question: What is the most important difference between a signal and an observable?
    options:
      - Observables are faster
      - A signal always has a current value, an observable delivers values over time
      - Signals only work in templates
      - There is none
    answer: 1
  - question: "What happens with `interval(1000)` if nobody subscribes?"
    options:
      - It counts in the background anyway
      - Nothing at all – it only starts with `subscribe()`
      - Angular subscribes automatically
      - It throws an error
    answer: 1
  - question: When do you have to unsubscribe yourself?
    options:
      - Never
      - For observables that don't end by themselves, e.g. `interval()`
      - Only for HTTP requests
      - Only for `of()`
    answer: 1
    explanation: "HTTP observables complete after the response. `interval()`, events or subjects keep running until you unsubscribe – otherwise you get a memory leak."
exercise:
  example: ex-stopwatch
  title: A stopwatch
  task: |-
    Build a stopwatch with `interval()` that counts up by 1 every 100 ms.

    1. **Start** subscribes to `interval(100)` and increases `ticks` on every value.
    2. **Stop** unsubscribes.
    3. A second click on **Start** must not start a second interval.
    4. Unsubscribe when the component is destroyed (`DestroyRef`).
  checks:
    counts-up: After **Start** the display counts up
    stops: After **Stop** the display stands still
    single-interval: Clicking **Start** twice doesn't count twice as fast
---

# Observables

A signal always has **one** current value. Some things, however, are more of a **stream of values**: clicks, key presses, a timer, messages from a server. For these, Angular uses the **RxJS** library and its central building block, the **observable**. You already used it with `HttpClient` in the last chapter.

## Values over time

An observable can send three kinds of notifications, one after another:

- `next(value)`: a new value. This can happen any number of times.
- `error(err)`: something went wrong. Nothing comes after it.
- `complete()`: the stream is over. Nothing comes after it either.

This is what a hand-made observable looks like:

```ts
const countdown$ = new Observable<string>((subscriber) => {
  subscriber.next('3');
  const t1 = setTimeout(() => subscriber.next('2'), 500);
  const t2 = setTimeout(() => subscriber.complete(), 1000);
  return () => [t1, t2].forEach(clearTimeout); // clean up
});
```

The `$` at the end of the name is a convention that marks the variable as an observable.

Most of the time you don't build observables yourself, you get them: from `HttpClient`, from forms or from functions like `interval(1000)`, `of(1, 2, 3)` or `fromEvent(button, 'click')`.

## Subscribing

An observable does nothing until someone **subscribes**. `subscribe()` starts it and defines what happens with the notifications:

```ts
countdown$.subscribe({
  next: (value) => console.log('next', value),
  error: (err) => console.error(err),
  complete: () => console.log('done'),
});
```

If you only care about the values, a function is enough: `interval(1000).subscribe((n) => console.log(n))`.

## Unsubscribing

`subscribe()` returns a `Subscription`. `unsubscribe()` ends it, and the observable cleans up (in the example above, the cleanup function runs):

```ts
private subscription?: Subscription;

start(): void {
  this.subscription = interval(1000).subscribe(() => this.seconds.update((s) => s + 1));
}

stop(): void {
  this.subscription?.unsubscribe();
}
```

> [!WARNING]
> Observables that don't end by themselves, like `interval()`, events or subjects, keep running even after the component is long gone. Unsubscribe at the latest when the component is destroyed, or you get a **memory leak**:
>
> ```ts
> inject(DestroyRef).onDestroy(() => this.subscription?.unsubscribe());
> ```
>
> In the third lesson you'll learn `takeUntilDestroyed()` and `toSignal()`, which let Angular do this for you.

::tryit{rxjs-observables}

## Subjects

A **subject** is an observable you can push values into yourself. That lets you connect events to an RxJS pipeline, for example:

```ts
const clicks$ = new Subject<string>();
clicks$.subscribe((v) => console.log(v));
clicks$.next('hello'); // → "hello"
```

A `BehaviorSubject` also remembers the last value and gives it to every new subscriber right away. Before signals existed, that was the usual way to hold state in services. Today you use a signal for that.

> [!TIP]
> If a service exposes a subject, expose it as `subject.asObservable()`. That way only the service itself can push values into it.

## Signals or observables?

| Aspect | Signal | Observable |
|---|---|---|
| Always has a value | yes | no |
| Good for | state ("what is true right now?") | events over time ("what happens?") |
| Starts | right away | on subscribe |
| Unsubscribe needed | no | for endless streams, yes |

The two complement each other. Use signals for state, and observables for time, events and asynchronous flows. The next lessons show how RxJS operators control such flows and how to switch between the two worlds.

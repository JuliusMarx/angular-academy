---
title: Operators
minutes: 9
quiz:
  - question: "What does `debounceTime(300)` do?"
    options:
      - It delays every value by 300 ms
      - It only passes a value on once no new one has arrived for 300 ms
      - It lets at most one value through every 300 ms and drops the rest immediately
      - It stops after 300 ms
    answer: 1
  - question: A user types fast and the responses arrive out of order. Which operator prevents an old response from overwriting the new one?
    options: ["mergeMap", "concatMap", "switchMap", "map"]
    answer: 2
    explanation: "`switchMap` unsubscribes from the old inner observable as soon as a new value arrives. The old request is cancelled, so its response never arrives."
  - question: "What does `of(1, 2, 3, 4).pipe(filter((n) => n % 2 === 0), map((n) => n * 10))` emit?"
    options: ["10, 20, 30, 40", "20, 40", "2, 4", "10, 30"]
    answer: 1
exercise:
  example: ex-search-pipeline
  title: A thrifty search
  task: |-
    The search sends a request on every key press. Add to the pipeline before `switchMap`:

    1. `map` with `trim()`: spaces at the edges don't count.
    2. `filter`: fewer than 2 characters send no request.
    3. `debounceTime(300)`: search only after a typing pause.
    4. `distinctUntilChanged()`: the same search isn't sent twice in a row.
  checks:
    finds-country: "`germ` finds Germany"
    ignores-short: A single letter sends no request
    debounces: Typing fast sends only one request
    no-duplicates: "`spain` with spaces isn't searched again"
---

# Operators

The strength of RxJS lies in its **operators**: small building blocks that change a stream. You chain them with `pipe()`, and every value runs through all of them in order.

## pipe, map and filter

```ts
import { filter, map, of } from 'rxjs';

of(1, 2, 3, 4)
  .pipe(
    filter((n) => n % 2 === 0), // even numbers only
    map((n) => n * 10),          // each times 10
  )
  .subscribe(console.log);       // → 20, 40
```

`pipe()` doesn't change the original observable; it returns a **new** one. Like arrays, there are `map` and `filter`, just for values that arrive one after another.

`tap()` passes values through unchanged and is handy for taking a peek: `tap((v) => console.log('value:', v))`.

## Controlling time

Some operators work with time, and this is where RxJS shines:

| Operator | Effect |
|---|---|
| `debounceTime(ms)` | only passes a value on once no new one has arrived for `ms` |
| `throttleTime(ms)` | lets at most one value through per `ms` |
| `distinctUntilChanged()` | drops a value if it equals the previous one |
| `delay(ms)` | delays every value |
| `take(n)` | takes the first `n` values, then completes |

## One observable per value: switchMap

A search needs an HTTP request for every input, so a **new observable per value**. That's what the `…Map` operators are for:

```ts
query$.pipe(
  map((q) => q.trim()),
  filter((q) => q.length >= 2),
  debounceTime(300),
  distinctUntilChanged(),
  switchMap((q) => this.countries.search(q)),
);
```

`switchMap` unsubscribes from the old observable as soon as a new value arrives. A request that is still running is **cancelled**. That way a slow old response can never overwrite the results of a newer search.

::tryit{rxjs-operators}

Type a word quickly in the example and watch the counter: instead of one request per key press, only one goes out. Change the pipeline and see what happens when you remove `debounceTime`.

The four `…Map` operators differ in what happens to an observable that is still running:

| Operator | When a new value arrives … | Typical use |
|---|---|---|
| `switchMap` | … the old one is cancelled | search, loading after a selection |
| `mergeMap` | … both run in parallel | independent requests |
| `concatMap` | … the new one waits until the old one is done | saving in a fixed order |
| `exhaustMap` | … the new one is ignored | double click on "Submit" |

## Errors and retries

You already know `catchError` and `retry` from the HTTP chapter. One important point in a pipeline: an error **ends** the stream. If you catch it on the outside, the search stops working afterwards. So catch it **inside** `switchMap`:

```ts
switchMap((q) =>
  this.countries.search(q).pipe(catchError(() => of([]))), // search stays alive
);
```

> [!TIP]
> You don't need to know all 100+ operators. `map`, `filter`, `tap`, `debounceTime`, `distinctUntilChanged`, `switchMap` and `catchError` get you a long way in Angular applications.

---
title: Async data with resource()
minutes: 9
summary: |-
  - `resource()` loads data asynchronously and exposes the result as signals.
  - `params` is reactive: when a signal inside it changes, the resource reloads automatically. If it returns `undefined`, the resource stays in status `'idle'`.
  - `loader` fetches the data and receives `params` and an `abortSignal` that cancels outdated requests.
  - State: `value()`, `hasValue()`, `isLoading()`, `error()` and `status()`.
  - `reload()` loads again, `set(…)` overwrites the value locally (status `'local'`).
  - For HTTP there is `httpResource()`, built on `HttpClient`.

  ```ts
  protected readonly user = resource({
    params: () => ({ id: this.userId() }),
    loader: ({ params, abortSignal }) =>
      fetch(`/api/users/${params.id}`, { signal: abortSignal }).then((r) => r.json()),
  });
  ```
quiz:
  - question: What happens when a signal read in params changes?
    options:
      - Nothing, you have to call reload()
      - The resource reloads automatically and aborts a running request
      - An error is thrown
      - The page reloads
    answer: 1
  - question: Which property tells you whether data is currently loading?
    options: ["value()", "isLoading()", "pending()", "loading"]
    answer: 1
  - question: What is the abortSignal parameter in the loader for?
    options:
      - To shut down the app
      - To cancel an outdated request when new params arrive
      - To suppress errors
      - To cache the result
    answer: 1
exercise:
  example: ex-resource
  title: Load a user
  task: |-
    `fetchUser()` in `user-api.ts` simulates a slow server request.

    1. Create a `resource()` that loads the user for `userId()` with `fetchUser()` – also when the id changes.
    2. While loading, show `<p id="loading">Loading …</p>`; on error, `<p id="error">` with the error message; otherwise `<h2 id="name">` with the name.
  checks:
    shows-loading: 'While loading, `<p id="loading">` is visible'
    shows-user: The selected user's name appears in `<h2 id="name">`
    shows-error: For **User 99** the error message appears in `<p id="error">`
---

# Async data with resource()

Signals are synchronous. Data from a server, however, is asynchronous – it takes time, can fail and is sometimes outdated before it arrives. `resource()` brings the two together: it loads data asynchronously and exposes the result as signals.

## Structure

```ts
import { Component, resource, signal } from '@angular/core';

@Component({ /* … */ })
export class UserProfile {
  protected readonly userId = signal(1);

  protected readonly user = resource({
    params: () => ({ id: this.userId() }),
    loader: ({ params, abortSignal }) =>
      fetch(`/api/users/${params.id}`, { signal: abortSignal }).then((r) => r.json()),
  });
}
```

- **`params`** is a reactive function. When a signal inside it changes, the resource reloads automatically.
- **`loader`** is an `async` function that fetches the data. It receives the current `params` and an `abortSignal`.
- If new `params` arrive while still loading, the old request is cancelled via the `abortSignal`.

## Showing the state

A resource exposes several signals:

| Signal | Meaning |
|---|---|
| `value()` | the loaded data (`undefined` before) |
| `hasValue()` | `true` when data is available |
| `isLoading()` | `true` while loading |
| `error()` | the error if loading failed |
| `status()` | `'idle'`, `'loading'`, `'reloading'`, `'resolved'`, `'error'` or `'local'` |

```html
@if (user.isLoading()) {
  <p>Loading …</p>
} @else if (user.error()) {
  <p>Error: {{ user.error()?.message }}</p>
} @else if (user.hasValue()) {
  <h2>{{ user.value().name }}</h2>
}
```

`user.reload()` loads the data again, `user.set(…)` overwrites the value locally (status `'local'`).

::tryit{resource-loader}

> [!NOTE]
> For HTTP requests there is a dedicated variant, `httpResource()`, built on `HttpClient`. You'll meet it in the *HTTP* chapter.

> [!TIP]
> If `params` returns `undefined`, the resource doesn't load and stays in status `'idle'` – useful for loading only once a user has been selected.

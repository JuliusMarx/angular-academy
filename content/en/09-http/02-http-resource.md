---
title: httpResource
minutes: 7
summary: |-
  - `httpResource()` is `resource()` tailored to `HttpClient`: you only provide a function that returns the URL. Stable since Angular 22.
  - If the function reads a signal, Angular reloads on every change and cancels older requests still in flight.
  - Like `HttpClient`, it needs no setup. Interceptors from `provideHttpClient(withInterceptors(…))` apply here too.
  - State: `value()`, `hasValue()` (narrows the type), `isLoading()`, `error()`. `reload()` loads again by hand.
  - The function can return an object with `url`, `params` and so on. If it returns `undefined`, nothing is loaded.
  - Use `httpResource` for reading, and keep using `HttpClient` for changes (POST, PUT, DELETE) and click actions.

  ```ts
  protected readonly id = signal(1);
  protected readonly product = httpResource<Product>(() => `/api/products/${this.id()}.json`);
  ```

  ```html
  @if (product.isLoading()) {
    <p>Loading …</p>
  } @else if (product.hasValue()) {
    <h2>{{ product.value().name }}</h2>
  }
  ```
quiz:
  - question: "When does `httpResource(() => '/api/users/' + this.id())` load again?"
    options:
      - Only on start
      - Every time `id()` changes
      - Every few seconds
      - Only after `reload()`
    answer: 1
    explanation: "The function reads a signal. When it changes, Angular rebuilds the URL and sends a new request. You can also load again by hand with `reload()`."
  - question: "What happens when the URL function returns `undefined`?"
    options:
      - "`/undefined` is loaded"
      - No request is sent
      - Angular throws an error
      - The last value is cleared and loaded again
    answer: 1
  - question: What do you still use `HttpClient` for instead of `httpResource`?
    options:
      - For lists
      - For data that changes with a signal
      - For changes like POST, PUT and DELETE
      - For JSON files
    answer: 2
exercise:
  example: ex-http-resource
  title: Loading users by ID
  task: |-
    The buttons change the ID, but nothing is loaded yet.

    1. Load the user with `httpResource<User>()` from `/api/users/<id>.json`. The URL depends on `id()`.
    2. In `#user`, show “Loading …”, the error text “User could not be loaded.” or name and city, e.g. “Ada Lovelace from London”, depending on the state.
  checks:
    shows-user: User 1 is shown
    follows-id: After **Next**, user 2 appears
    shows-error: The missing user 3 shows the error message
---

# httpResource

In the *Signals* chapter you met `resource()`: a value that is loaded asynchronously and reloads when signals change. `httpResource()` is exactly that, tailored to `HttpClient`. Instead of a loader function you only provide the URL.

> [!NOTE]
> `httpResource` is stable since Angular 22. The live examples run on Angular 21, where it is still marked *experimental*. The API is the same.

## A URL that changes

```ts
import { httpResource } from '@angular/common/http';

protected readonly id = signal(1);
protected readonly product = httpResource<Product>(() => `/api/products/${this.id()}.json`);
```

The function reads `id()`. When the ID changes, Angular sends a new request automatically. If an older request is still on its way, it is cancelled, so a stale response can't overwrite the new one.

`httpResource` uses `HttpClient` internally and, like it, needs no setup. Interceptors you register with `provideHttpClient(withInterceptors(…))` therefore apply here too.

## Showing the state

The resource has the same signals as `resource()`:

| Signal | Meaning |
|---|---|
| `value()` | the response (`undefined` before the first one) |
| `hasValue()` | `true` as soon as there is a value |
| `isLoading()` | a request is running |
| `error()` | the error of the last request, otherwise `undefined` |

```html
@if (product.isLoading()) {
  <p>Loading …</p>
} @else if (product.error()) {
  <p>The product could not be loaded.</p>
} @else if (product.hasValue()) {
  <h2>{{ product.value().name }}</h2>
}
```

`hasValue()` narrows the type: inside the `@if` block TypeScript knows that `value()` is not `undefined`.

::tryit{http-resource}

In the example, click **Next** up to product 4: that file doesn't exist, the server answers with 404 and `error()` is set.

## More than a URL

Instead of a string, the function can return an object with parameters, headers or a different method:

```ts
protected readonly results = httpResource<Product[]>(() => ({
  url: '/api/products',
  params: { q: this.query(), page: this.page() },
}));
```

If the function returns `undefined`, nothing is loaded **at all**. That lets you wait until all inputs are there:

```ts
protected readonly user = httpResource<User>(() => {
  const id = this.selectedId();
  return id === null ? undefined : `/api/users/${id}`;
});
```

`reload()` loads again by hand, for example from a "Refresh" button.

## httpResource or HttpClient?

- **Reading** data that depends on signals: `httpResource`. You write less code and get the loading state and errors for free.
- **Changing** data (POST, PUT, DELETE) or requests triggered by a click: `HttpClient`. A resource loads whenever its signals change, which doesn't fit "save exactly once".

> [!TIP]
> After saving with `HttpClient`, call `reload()` on the resource so the page shows the new state.

---
title: HttpClient
minutes: 8
summary: |-
  - Since Angular 21 you can inject `HttpClient` without any setup. You only need `provideHttpClient()` to configure it, for example with `withInterceptors()`.
  - Requests belong in a service. `get<Product[]>()` only tells TypeScript the type – nothing checks the response.
  - The result is a cold observable: the request only goes out on subscribe. HTTP observables complete by themselves afterwards.
  - `toSignal()` subscribes for you and turns it into a signal (`initialValue` until the response, otherwise `undefined`). For actions such as clicks, use `subscribe()`.
  - For changes there are `post`, `put`, `patch` and `delete`. Pass query parameters and headers as options (`params`, `headers`).

  ```ts
  export class ProductService {
    private readonly http = inject(HttpClient);
    getAll(): Observable<Product[]> {
      return this.http.get<Product[]>('/api/products.json');
    }
  }

  protected readonly products = toSignal(this.productService.getAll(), { initialValue: [] });
  ```

  > [!WARNING] `post()` and `delete()` also only send on `subscribe()`. A forgotten `subscribe()` is a common reason why "nothing happens".
quiz:
  - question: What do you need `provideHttpClient()` for in current Angular versions?
    options:
      - Without it, `HttpClient` can't be injected
      - To configure `HttpClient`, for example with interceptors
      - To import `HttpClientModule` in every component
      - To install the npm package
    answer: 1
    explanation: "Since Angular 21, `HttpClient` can be injected without any setup. You only need `provideHttpClient()` when you want to customize it."
  - question: "When does `this.http.get('/api/todos')` send the request?"
    options:
      - Right away when `get()` is called
      - Only when someone subscribes to the observable
      - On the next render
      - When the component is destroyed
    answer: 1
    explanation: "Observables from HttpClient are *cold*: without `subscribe()` (or `toSignal()`, which subscribes internally) nothing happens."
  - question: "What does `get<Todo[]>(...)` do?"
    options:
      - Angular checks the response against the type at runtime
      - TypeScript treats the response as `Todo[]`, but nothing checks it
      - The response is converted into Todo objects
      - The server is told the type
    answer: 1
exercise:
  example: ex-http-client
  title: Loading Todos from the Server
  task: |-
    The todo list is empty. Load it from `/api/todos.json`.

    1. Inject `HttpClient` in `TodoService` and load the list with `get<Todo[]>()`.
    2. In the component, turn the observable into a signal with `toSignal()` (with `initialValue: []`).
  checks:
    loads-todos: The list shows three todos
    shows-titles: The first entry is “Buy milk”
    open-count: The counter shows “2 open”
---

# HttpClient

So far all data came straight from the code. In real applications it lives on a server. Angular ships **HttpClient** for talking to it. It sends requests, converts JSON automatically and can be extended with interceptors (more on that two lessons from now).

> [!NOTE]
> The live examples load their data from JSON files in the `public/api/` folder. The dev server serves them like a real API. You can open and change the files in the editor.

## Setup

Nothing to do: since Angular 21, you can inject `HttpClient` anywhere without any setup. Only when you want to customize it, for example with interceptors, do you call `provideHttpClient()` in the app config:

```ts
import { provideHttpClient, withInterceptors } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(withInterceptors([authInterceptor]))],
};
```

Older projects and tutorials always add `provideHttpClient()`. That does no harm, but it isn't needed anymore.

> [!NOTE]
> Since Angular 22, `HttpClient` sends requests through the browser's `fetch` API. In Angular 21, where the live examples run, `XMLHttpRequest` is still the default. There, `provideHttpClient(withFetch())` switches to `fetch`. In Angular 22, `withFetch()` is unnecessary and deprecated.

## Loading data

Requests belong in a service, not in the component. That way every component can reuse them, and in tests you only replace the service:

```ts
@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>('/api/products.json');
  }
}
```

- `get<Product[]>` tells TypeScript what shape the response has. Nothing **checks** it: if the server sends something else, you only find out at runtime.
- The result is an **observable**, a stream of values from the RxJS library. For HTTP it emits exactly one value, the response.

## Using the response

An observable from `HttpClient` is **cold**: the request only goes out when someone subscribes. There are two ways to do that.

**`toSignal()`** subscribes for you and turns the response into a signal. It is the most convenient way when the data should load on start:

```ts
import { toSignal } from '@angular/core/rxjs-interop';

protected readonly products = toSignal(this.productService.getAll(), { initialValue: [] });
```

Until the response arrives, the signal holds the `initialValue`. Without one it is `undefined`, which is handy for a "Loading …" message.

**`subscribe()`** is what you need when the request should only go out on an action, such as a click:

```ts
protected countInStock(): void {
  this.productService.getAll().subscribe((list) => {
    this.inStock.set(list.filter((p) => p.stock > 0).length);
  });
}
```

::tryit{http-client}

> [!TIP]
> HTTP observables complete by themselves after the response. You don't need to `unsubscribe()` from them.

## Sending data

For changes there are `post`, `put`, `patch` and `delete`. For `post`, `put` and `patch` the second parameter is the body, and `HttpClient` converts it to JSON. `delete` has no body, only the URL:

```ts
create(product: NewProduct): Observable<Product> {
  return this.http.post<Product>('/api/products', product);
}

remove(id: number): Observable<void> {
  return this.http.delete<void>(`/api/products/${id}`);
}
```

Pass query parameters and headers as options:

```ts
this.http.get<Product[]>('/api/products', {
  params: { sort: 'price', limit: 10 },  // → /api/products?sort=price&limit=10
  headers: { 'Accept-Language': 'en' },
});
```

> [!WARNING]
> `post()` and `delete()` also only send on `subscribe()`. A forgotten `subscribe()` is a common reason why "nothing happens".

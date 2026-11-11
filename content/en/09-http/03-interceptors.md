---
title: Interceptors and Error Handling
minutes: 9
summary: |-
  - An interceptor (`HttpInterceptorFn`) is a function that sees every request `req` and passes it on with `next(req)`.
  - Requests are immutable: `req.clone({ setHeaders: … })` creates a changed copy. `inject()` works inside an interceptor.
  - Register them with `provideHttpClient(withInterceptors([…]))`. The request runs left to right, the response comes back in reverse.
  - On failure you get an `HttpErrorResponse`: `status` `0` means no response, `4xx` an error in the request, `5xx` an error on the server.
  - `catchError` catches errors, `retry` pays off for `0` and `5xx`. An error interceptor passes the error on with `throwError`.
  - With `httpResource` you don't need `catchError`, the error ends up in `error()`.

  ```ts
  export const authInterceptor: HttpInterceptorFn = (req, next) => {
    if (!req.url.startsWith('/api/')) return next(req);
    return next(req.clone({ setHeaders: { Authorization: `Bearer ${inject(Auth).token()}` } }));
  };
  ```

  > [!WARNING] If you add the token to every request, foreign servers get it too. Only send it to your own API.
quiz:
  - question: Why does an interceptor call `req.clone(...)` instead of changing `req` directly?
    options:
      - Because `clone()` is faster
      - Because requests are immutable
      - So the request is sent twice
      - Because `req` only exists in tests
    answer: 1
  - question: "An interceptor adds the token to every request. What is the problem?"
    options:
      - There is none
      - The token also goes to foreign servers
      - Requests get slower
      - Angular rejects such requests
    answer: 1
  - question: "An `HttpErrorResponse` has status `0`. What does that usually mean?"
    options:
      - Everything worked
      - The server answered with an error
      - No response arrived at all, e.g. because the network is down or CORS blocked it
      - The file was empty
    answer: 2
exercise:
  example: ex-interceptor
  title: Tokens and Error Messages
  task: |-
    The profile can't be loaded (401), and errors go unnoticed.

    1. Write the `authInterceptor` in `interceptors.ts`: it adds `Authorization: Bearer demo-token` to every request to `/api/`, but **not** to foreign servers.
    2. Write the `errorInterceptor`: on an error it shows “Request failed: <status>” in the `ErrorBanner` and passes the error on.
    3. Register both in `app.config.ts`, before `fakeBackendInterceptor`. That one plays the server and must stay last in the list.
  checks:
    adds-token: "**Load profile** shows “Signed in as Ada Lovelace”"
    token-only-for-api: The foreign analytics server gets no token
    error-banner: "A missing file shows “Request failed: 404” in the banner"
---

# Interceptors and Error Handling

Some things apply to every request: sending a login token, reporting errors, logging requests. Instead of repeating that in every service, you write an **interceptor**. It sits between your code and the network and sees every request and every response.

## An interceptor

An interceptor is a function. It receives the request `req` and `next`, the next link in the chain. Calling `next(req)` passes the request on:

```ts
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith('/api/')) return next(req);
  return next(req.clone({ setHeaders: { Authorization: `Bearer ${inject(Auth).token()}` } }));
};
```

- Requests are **immutable**. `clone()` creates a changed copy.
- The token only goes to your own API. If you add it to every request, foreign servers get it too, for example for analytics or maps.
- `inject()` works because Angular calls interceptors in an injection context.

You register interceptors with `provideHttpClient()`:

```ts
provideHttpClient(withInterceptors([loggingInterceptor, authInterceptor]));
```

The **order** matters: the request runs through the list from left to right, and the response comes back in reverse.

## Reacting to the response

`next(req)` returns an observable of the response. RxJS operators let you react to it, for example to measure the duration:

```ts
export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const started = Date.now();
  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) console.log(req.url, event.status, `${Date.now() - started} ms`);
    }),
  );
};
```

> [!NOTE]
> `pipe`, `tap`, `catchError`, `retry`, `throwError` and `EMPTY` come from RxJS: `pipe` chains operators, `tap` peeks at values without changing them, `catchError` catches errors, `retry` tries again, `throwError` creates an observable that fails, and `EMPTY` completes without a value. Chapter 10 (RxJS) explains them properly. For now, this overview is enough.

::tryit{http-interceptors}

The example contains a `fakeBackendInterceptor`. It answers `/api/me` itself instead of passing the request on, just like a real server that checks the login. Interceptors like this are also handy for developing without a backend.

## Handling errors

When a request fails, you get an `HttpErrorResponse`. Its `status` tells you what happened:

| Status | Meaning |
|---|---|
| `0` | no response: no network, server unreachable or blocked by CORS |
| `400`–`499` | an error in the request, e.g. `401` not signed in, `404` not found |
| `500`–`599` | an error on the server |

`catchError` catches the error, and `retry` tries again before that:

```ts
this.http.get<News[]>('/api/news').pipe(
  retry(2),
  catchError((err: HttpErrorResponse) => {
    this.error.set(err.status === 404 ? 'Not found.' : 'Loading failed.');
    return EMPTY; // pass nothing on, the error is handled
  }),
);
```

> [!TIP]
> `retry` pays off for status `0` and `5xx`: the network or server may just have hiccupped. For `4xx` a second attempt gets the same answer.

For messages that should look the same everywhere, an error interceptor is a good fit. It shows the message and passes the error on with `throwError`, so the calling code can still react:

```ts
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const banner = inject(ErrorBanner);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      banner.show(`Request failed: ${error.status}`);
      return throwError(() => error);
    }),
  );
};
```

With `httpResource` you don't need `catchError`. The error ends up in `error()`, and you show it in the template.

> [!WARNING]
> An error nobody handles only shows up in the console. The user simply sees nothing. For every request, think about what the user should see when it fails.

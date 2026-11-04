---
title: Testing HTTP
minutes: 8
summary: |-
  - Tests don't need a real server: `provideHttpClientTesting()` intercepts every request. It must come **after** `provideHttpClient()`.
  - With the `HttpTestingController` you expect and answer requests.
  - `expectOne(url)` fails unless there is exactly one matching request. For parameters, pass a function.
  - `req.flush(data)` delivers the response, `req.request` shows method, body, headers and parameters.
  - Simulate server errors with `flush('…', { status: 500, statusText: '…' })`.
  - `http.verify()` in `afterEach` fails the test if an unexpected request was left open.

  ```ts
  service.names().subscribe((n) => (names = n));

  const req = http.expectOne('/api/users');
  expect(req.request.method).toBe('GET');
  req.flush([{ id: 1, name: 'Grace' }, { id: 2, name: 'Ada' }]);

  expect(names).toEqual(['Ada', 'Grace']);
  ```
quiz:
  - question: "What does `provideHttpClientTesting()` do?"
    options:
      - It sends the requests to a test server
      - It intercepts all requests so the test can answer them itself
      - It turns off HTTP in tests
      - It caches real responses
    answer: 1
  - question: "What does `http.verify()` check in `afterEach`?"
    options:
      - Whether all responses were valid JSON
      - Whether no unexpected request is still open
      - Whether the server is reachable
      - Whether the tests were fast enough
    answer: 1
  - question: How do you test that your service handles a server error?
    options:
      - Turn off the real server
      - "`req.flush(body, { status: 500, statusText: '…' })`"
      - That can't be tested
      - "`expect(http).toThrow()`"
    answer: 1
exercise:
  example: ex-test-http
  title: Tests for a weather service
  task: |-
    Write tests for the `Weather` service in `weather.spec.ts`:

    1. `forecast('Berlin')` sends `GET /api/weather` with the parameter `city=Berlin`.
    2. For the response `{ city: 'Berlin', temperature: 11.6 }` it returns “12 °C”.
    3. For status 404 it returns “Unknown city”.
  checks:
    tests-pass: Your tests pass against the real service
    catches-param-bug: A test notices a wrong parameter name
    catches-rounding-bug: A test notices when the temperature isn't rounded
    catches-error-bug: A test notices when errors aren't caught
---

# Testing HTTP

Services that load data shouldn't need a **real server** in tests. It would be slow, it could go down, and its data changes. Angular ships a test backend for this: it intercepts every request, and your test decides what the "server" answers.

## Setting up the test backend

```ts
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [provideHttpClient(), provideHttpClientTesting()],
  });
  service = TestBed.inject(UserService);
  http = TestBed.inject(HttpTestingController);
});

afterEach(() => {
  http.verify();
});
```

`provideHttpClientTesting()` must come **after** `provideHttpClient()`. `http.verify()` fails the test if a request it didn't expect is still open.

## Expecting and answering a request

The flow is always the same: call the method, expect the request, deliver the response, check the result.

```ts
it('loads and sorts the names', () => {
  let names: string[] = [];
  service.names().subscribe((n) => (names = n));

  const req = http.expectOne('/api/users');
  expect(req.request.method).toBe('GET');
  req.flush([{ id: 1, name: 'Grace' }, { id: 2, name: 'Ada' }]);

  expect(names).toEqual(['Ada', 'Grace']);
});
```

- `expectOne(url)` fails unless there is exactly **one** matching request.
- `req.request` shows you the method, body, headers and parameters.
- `req.flush(data)` answers the request. The code in `subscribe` runs right away.

For parameters, pass a function instead of a URL:

```ts
http.expectOne((req) => req.url === '/api/weather' && req.params.get('city') === 'Berlin');
```

## Simulating errors

A status and text in `flush` imitate a server error, without a broken server:

```ts
http.expectOne('/api/users').flush('Server error', { status: 500, statusText: 'Internal Server Error' });
expect(names).toEqual([]);
```

::tryit{testing-http}

> [!TIP]
> Test the cases that rarely happen in production: 404, 500, empty lists. They are hard to reach in the browser, but in a test they take one line.

## What you can test now

| What | Tool |
|---|---|
| Functions and services | `TestBed.inject()`, `expect()` |
| Replacing dependencies | `providers: [{ provide, useValue }]`, `vi.fn()` |
| Components | `TestBed.createComponent()`, `whenStable()`, `setInput()` |
| HTTP | `provideHttpClientTesting()`, `HttpTestingController` |

For flows across several pages, such as "sign in, add a product to the cart, check out", there are **end-to-end tests** with tools like Playwright. They drive a real browser and complement unit tests. They can't replace them, because they are much slower.

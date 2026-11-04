---
title: Unit tests and services
minutes: 9
summary: |-
  - New Angular projects test with **Vitest**. Tests live in `.spec.ts` files next to the code, `ng test` runs them.
  - `describe` groups tests, `it` is a single test, `expect(value)` checks with a matcher.
  - `toBe()` for numbers, strings and booleans, `toEqual()` for objects and arrays. `.not` inverts any matcher.
  - `TestBed.inject(Service)` creates a service just like in the app. The `TestBed` is reset after every test.
  - You replace dependencies with `{ provide, useValue }` and check calls with `vi.fn()` and `toHaveBeenCalledWith()`.

  ```ts
  const save = vi.fn();
  TestBed.configureTestingModule({ providers: [{ provide: Storage, useValue: { save } }] });

  TestBed.inject(Settings).setTheme('dark');
  expect(save).toHaveBeenCalledWith('theme', 'dark');
  ```

  > [!TIP] Break a test on purpose. If it doesn't fail, it checks less than you think.
quiz:
  - question: What is `TestBed.inject(Cart)` good for?
    options:
      - It creates the service like the app does, with all its dependencies
      - It starts the whole application
      - It replaces the service with a mock
      - It is only needed for components
    answer: 0
  - question: "What is the difference between `toBe` and `toEqual`?"
    options:
      - There is none
      - "`toBe` compares identity, `toEqual` compares content"
      - "`toEqual` is only for numbers"
      - "`toBe` is deprecated"
    answer: 1
    explanation: "`expect([1]).toBe([1])` fails because they are two different arrays. `toEqual` compares the content and passes."
  - question: Why do you replace a dependency with a stand-in in a test?
    options:
      - Because tests won't compile otherwise
      - So the test checks only one class and decides what the dependency does
      - Because Angular requires it
      - So the test runs slower
    answer: 1
exercise:
  example: ex-test-service
  title: Tests for a todo list
  task: |-
    Write tests for the `TodoList` service in `todo-list.spec.ts`:

    1. `add()` creates an open todo with the right title.
    2. `toggle()` marks a todo as done, and `remaining()` goes down.
    3. `clearCompleted()` removes **only** the done todos.

    The check also runs your tests against deliberately broken versions of `TodoList`. Good tests fail for them.
  checks:
    tests-pass: Your tests pass against the real `TodoList`
    catches-add-bug: A test notices when `add()` creates todos that are already done
    catches-toggle-bug: A test notices when `toggle()` does nothing
    catches-clear-bug: A test notices when `clearCompleted()` removes everything
---

# Unit tests and services

A **unit test** checks a small part of your app on its own, such as a service or a function. It runs in milliseconds, and you can repeat it after every change. That way you notice right away when you broke something, instead of your users noticing.

## Running tests

New Angular projects test with **Vitest**. Tests live in files ending in `.spec.ts` next to the code, and `ng test` runs them:

```bash
ng test
```

Vitest watches the files and runs the affected tests again on every change.

> [!NOTE]
> In the live examples the tests run right in the preview, with a small runner that uses the same functions (`describe`, `it`, `expect`, `vi`) and Angular's real `TestBed`. The spec files look exactly like in your project. Only the `src/specs.ts` file that lists the specs isn't needed there.

## The anatomy of a test

```ts
describe('formatPrice', () => {
  it('shows two decimals', () => {
    expect(formatPrice(4)).toBe('€4.00');
  });
});
```

- `describe` groups related tests.
- `it` is a single test. Its name describes the expected behaviour, and together they read like a sentence: "formatPrice shows two decimals".
- `expect(value)` with a **matcher** checks the result. If it doesn't match, the test fails.

The most important matchers:

| Matcher | Checks |
|---|---|
| `toBe(x)` | identity (`Object.is`, almost like `===`), for numbers, strings and booleans |
| `toEqual(x)` | same content, for objects and arrays |
| `toBeTruthy()` / `toBeFalsy()` | truthiness |
| `toContain(x)` | array or string contains `x` |
| `toHaveLength(n)` | length |
| `toThrow()` | function throws an error |

`.not` turns any matcher around: `expect(list).not.toContain('Ada')`.

## Testing services

You create services with `TestBed`. It builds an injector like the app does, so `inject()` inside the service works in the test too:

```ts
describe('Cart', () => {
  let cart: Cart;

  beforeEach(() => {
    cart = TestBed.inject(Cart);
  });

  it('multiplies price and quantity', () => {
    cart.add({ name: 'Coffee', price: 3, quantity: 2 });
    expect(cart.total()).toBe(6);
  });
});
```

`beforeEach` runs before **every** test. After each test, Angular resets the `TestBed`. Every test gets a fresh service, and no test depends on the state left by another.

## Replacing dependencies

When a service depends on another one, replace that one in the test with a **stand-in**. The test then checks only the one class, and you decide what the dependency returns:

```ts
TestBed.configureTestingModule({
  providers: [{ provide: Coupons, useValue: { discount: signal(0.1) } }],
});
const cart = TestBed.inject(Cart);
```

To check **whether** and **how** a function was called, use a mock function:

```ts
const save = vi.fn();
TestBed.configureTestingModule({ providers: [{ provide: Storage, useValue: { save } }] });

TestBed.inject(Settings).setTheme('dark');
expect(save).toHaveBeenCalledWith('theme', 'dark');
```

::tryit{testing-basics}

> [!TIP]
> Break a test on purpose, for example by changing the expected number. If it doesn't fail, it checks less than you think. That is exactly how the exercise check below works: it puts bugs into the code and sees whether your tests find them.

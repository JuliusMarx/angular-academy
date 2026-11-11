---
title: Services and inject()
minutes: 9
summary: |-
  - A service bundles state and logic that several components need. Angular creates and hands it out via dependency injection.
  - `@Injectable({ providedIn: 'root' })` registers it with the root injector: exactly one instance for the whole app.
  - Since Angular 22 there is the shorthand `@Service()` (only `inject()`, no constructor parameters). The live examples on Angular 21 still use `@Injectable`.
  - `inject(CartService)` gets the service – all components receive the same instance.
  - With `asReadonly()` you expose signals read-only, changes go through the service's methods.
  - `inject()` only works in an injection context: as a field initializer or in the constructor, not in methods (`NG0203`).

  ```ts
  @Injectable({ providedIn: 'root' })
  export class CartService {
    private readonly items = signal<Product[]>([]);
    readonly products = this.items.asReadonly();

    add(product: Product): void {
      this.items.update((items) => [...items, product]);
    }
  }
  ```

  > [!TIP] Never write `new CartService()` – you'd get a second, independent instance.
quiz:
  - question: "What does `providedIn: 'root'` do?"
    options:
      - Every component gets its own instance
      - There is exactly one instance for the whole app
      - The service is only available in app.ts
      - The service is created anew on every call
    answer: 1
  - question: How does a component get a service?
    options: ["`new CartService()`", "`inject(CartService)`", "`CartService.getInstance()`", "`import { cart } from './cart'`"]
    answer: 1
    explanation: With `inject()`, Angular takes care of creating it – and everyone gets the same instance.
  - question: Why does the CartService only expose a read-only signal?
    options:
      - Because signals can't be exported any other way
      - So that changes only go through the service's methods
      - Because it's faster
      - So that the template can't access it
    answer: 1
exercise:
  example: ex-service
  title: Favorites for Everyone
  task: |-
    The product list and the header should know the same favorites.

    1. In `favorites.service.ts`, create a `FavoritesService` with `providedIn: 'root'`: a private signal with the product names, `toggle(name)`, `isFavorite(name)` and a `computed()` `count`.
    2. Inject it into `ProductList`: the button toggles the favorite and sets `aria-pressed`.
    3. Inject it into `App` and show `count()` in `#fav-count`.
  checks:
    adds-favorite: Clicking **♥ Mug** shows **1** at the top
    counts-several: A second favorite raises it to **2**
    toggles-off: Clicking **♥ Mug** again removes it, and `aria-pressed` is right
---

# Services and inject()

So far all state lived in components. That gets cramped quickly: the product list adds something to the cart, the header should show the count, the checkout the total. With inputs and outputs, the cart would have to be passed through many levels.

A **service** is a class that bundles state and logic several components need. Angular creates it and hands it to every component that asks for it – this is called **dependency injection** (DI).

## A service

```ts
import { computed, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly items = signal<Product[]>([]);

  readonly products = this.items.asReadonly();
  readonly total = computed(() => this.items().reduce((sum, p) => sum + p.price, 0));

  add(product: Product): void {
    this.items.update((items) => [...items, product]);
  }
}
```

- `@Injectable({ providedIn: 'root' })` registers the service with the **root injector**: there is exactly **one** instance for the whole app.
- `asReadonly()` exposes the signal for reading only. Changes go through the service's methods – so it stays clear who changes what.

> [!NOTE]
> Angular 22 adds the shorthand `@Service()` for this. Like `@Injectable({ providedIn: 'root' })`, it provides one instance for the whole app, but it only supports `inject()`, not constructor parameters. The live examples run on Angular 21 and therefore use the longer form.

## Using a service

A component gets the service with `inject()`:

```ts
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-cart-summary',
  template: `<p>Total: {{ cart.total() }} €</p>`,
})
export class CartSummary {
  protected readonly cart = inject(CartService);
}
```

A second component that also calls `inject(CartService)` gets **the same instance**. When the product list adds something, the summary sees it right away – without the two components knowing about each other.

::tryit{services-cart}

## Where inject() is allowed

`inject()` only works in an **injection context**. In classes, that means as a field initializer or in the constructor of components, directives, pipes and services. Angular also calls provider factories, guards and interceptors, among others, in an injection context.

```ts
export class CartSummary {
  private readonly cart = inject(CartService); // ✅ field

  constructor() {
    const logger = inject(Logger);              // ✅ constructor
  }

  onClick(): void {
    inject(CartService);                        // ❌ error NG0203
  }
}
```

> [!TIP]
> Never write `new CartService()`. You'd get a second, independent instance – and the components would no longer see the same cart.

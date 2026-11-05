---
title: Architecture
minutes: 9
summary: |-
  - Organize files by **feature** (`products/`, `cart/`), not by technical type. Only what several features really need goes into `shared/`.
  - Presentational components get data via `input()`, report actions via `output()` and know no services.
  - Containers inject services and pass the data down.
  - Shared state belongs in a service with signals (a *store*): the signal `private`, changes only through methods, `computed()` to the outside.
  - For very large apps there are libraries like **NgRx SignalStore** built on the same principle.

  ```ts
  @Injectable({ providedIn: 'root' })
  export class CartStore {
    private readonly items = signal<Product[]>([]);
    readonly count = computed(() => this.items().length);

    add(product: Product): void {
      this.items.update((items) => [...items, product]);
    }
  }
  ```
quiz:
  - question: What characterizes a presentational component?
    options:
      - It loads its data from the server itself
      - It gets data through inputs and reports actions through outputs – without knowing any services
      - It contains the routing
      - It must not have styles
    answer: 1
  - question: Where does state go that several components share?
    options:
      - Into a global variable
      - Into a service with signals
      - Into the component that loads first
      - Into `localStorage`
    answer: 1
  - question: How do you best organize the files of a growing app?
    options:
      - By type – all components in one folder, all services in another
      - By feature – everything about "products" in one folder, everything about the "cart" in another
      - Everything in one folder
      - Alphabetically
    answer: 1
exercise:
  example: ex-architecture
  title: Splitting up an app
  task: |-
    The whole app lives in one component. Split it up:

    1. `CartStore`: move `items`, `count`, `total` and `add()` from `App` into the service.
    2. `ProductCard`: a presentational component with `input.required<Product>()` and an `output()` named `add`, using the template of one card.
    3. `CartBadge`: shows “🛒 2 items · €284.00” and reads the values from `CartStore`.
    4. `App` uses `<app-cart-badge />` and `<app-product-card>` and has no cart state of its own anymore.
  checks:
    product-cards: "There are three `<app-product-card>` elements"
    card-adds-to-cart: A card's button puts the product into the cart
    badge-total: The badge shows the count and the total
---

# Architecture

Small apps work with almost any structure. But once an app grows to dozens of pages and several developers, architecture decides whether new features are easy or painful. A few rules have proven themselves.

## Folders by feature

Organize files by **business area**, not by technical type:

```
src/app/
  products/
    product.ts            ← type
    product-card.ts       ← presentational
    product-list.ts       ← container
    product.routes.ts     ← the feature's lazy route
  cart/
    cart-store.ts         ← state
    cart-badge.ts
  shared/
    ui/button.ts          ← really used everywhere
```

Everything that belongs to a feature sits together. A feature can then be lazy loaded, moved or deleted as a whole. Only what several features really need goes into `shared/`.

## Containers and presentational components

A proven pattern splits components into two roles:

- **Presentational components** only display. They get data through `input()` and report actions through `output()`. They don't know any services, so they can be reused anywhere and are easy to test.
- **Containers** know where the data comes from and what happens on an action. They inject services and pass the data down.

```ts
// presentational
export class ProductCard {
  readonly product = input.required<Product>();
  readonly add = output();
}
```

```html
<!-- container -->
@for (product of products; track product.id) {
  <app-product-card [product]="product" (add)="cart.add(product)" />
}
```

::tryit{architecture}

## State in services

State that several components need belongs in a **service with signals**, often called a *store*:

```ts
@Injectable({ providedIn: 'root' })
export class CartStore {
  private readonly items = signal<Product[]>([]);
  readonly count = computed(() => this.items().length);

  add(product: Product): void {
    this.items.update((items) => [...items, product]);
  }
}
```

- The `items` signal is `private`. Only the store itself can change it, through methods with meaningful names.
- From the outside there are only readable values, usually `computed()`.
- Components like `CartBadge` inject the store and read from it. There's no need to pass values down through many levels.

> [!TIP]
> For very large apps there are libraries like **NgRx SignalStore** that implement this pattern with ready-made building blocks. The principle stays the same: state in one place, changes only through clearly named methods.

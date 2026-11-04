---
title: Route and query parameters
minutes: 9
summary: |-
  - A colon marks a route parameter: `products/:id` matches `/products/1`, `/products/2` and so on.
  - With `provideRouter(routes, withComponentInputBinding())`, route and query parameters arrive as inputs. The input's name must match the parameter (`:id` → `id`).
  - URLs consist of text: `transform: numberAttribute` turns the parameter into a number.
  - When only the parameter changes, the component stays and just the input changes – with `computed()`, the view updates automatically.
  - `[routerLink]="['/products', p.id]"` builds the URL from an array, `[queryParams]` adds query parameters such as `?sort=price`.
  - To navigate from code, use `inject(Router)` and `router.navigate(['/products'])`.

  ```ts
  export class ProductDetail {
    readonly id = input.required({ transform: numberAttribute });
    protected readonly product = computed(() => PRODUCTS.find((p) => p.id === this.id()));
  }
  ```
quiz:
  - question: "Which URL matches the route `products/:id`?"
    options: ["/products", "/products/42", "/products?id=42", "/products/42/edit"]
    answer: 1
  - question: What does `withComponentInputBinding()` do?
    options:
      - Inputs are saved automatically
      - Route and query parameters arrive as inputs in the component
      - All components get an id
      - It enables lazy loading
    answer: 1
  - question: "What type does the parameter `:id` have in the URL at first?"
    options: [number, string, boolean, It depends on the route]
    answer: 1
    explanation: "URLs consist of text – `transform: numberAttribute` turns it into a number."
exercise:
  example: ex-params
  title: A book detail page
  task: |-
    The book list shows titles, but the detail page can't be reached.

    1. In `app.config.ts`, add the route `'books/:id'` for `BookDetail`.
    2. Make route parameters arrive as inputs (`withComponentInputBinding()`). `BookDetail` already has an input `id`.
    3. In `book-list.ts`, link every title to `/books/<id>`.
  checks:
    list-links: Clicking **Dune** leads to `/books/2`
    detail-from-param: "`/books/3` shows **Neuromancer**"
    unknown-id: "`/books/99` shows **Book not found**"
---

# Route and query parameters

Creating one detail page per product would be absurd. Instead, there is **one** route with a placeholder – and the component reads from the URL which product is meant.

## Route parameters

A colon marks a parameter:

```ts
const routes: Routes = [
  { path: 'products', component: ProductList },
  { path: 'products/:id', component: ProductDetail }, // /products/1, /products/2, …
];
```

## Receiving parameters as inputs

With `withComponentInputBinding()`, parameters arrive directly as **inputs** in the component:

```ts
provideRouter(routes, withComponentInputBinding())
```

```ts
@Component({ /* … */ })
export class ProductDetail {
  readonly id = input.required({ transform: numberAttribute });
  protected readonly product = computed(() => PRODUCTS.find((p) => p.id === this.id()));
}
```

The input's name has to match the parameter's name – `:id` → `id`. Because URLs consist of text, `numberAttribute` turns the value into a number.

> [!TIP]
> When the user goes from `/products/1` straight to `/products/2`, Angular keeps the same component and only changes the input. Because `product` is a `computed()`, the view updates automatically.

## Links with parameters

`routerLink` also takes an array – the parts are joined into the URL:

```html
<a [routerLink]="['/products', p.id]">{{ p.name }}</a>
```

## Query parameters

For optional details such as sorting or filters there are query parameters: `/products?sort=price`. They don't need a route of their own and, with `withComponentInputBinding()`, arrive as an input too:

```html
<a routerLink="." [queryParams]="{ sort: 'price' }">by price</a>
```

```ts
readonly sort = input<string>(); // from ?sort=…
```

## Navigating from code

Sometimes not a link but your code should navigate – for example after saving a form:

```ts
private readonly router = inject(Router);

save(): void {
  // … save …
  this.router.navigate(['/products']);
}
```

::tryit{routing-params}

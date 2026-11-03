---
title: Parameter und Query-Parameter
minutes: 9
quiz:
  - question: "Welche URL passt auf die Route `products/:id`?"
    options: ["/products", "/products/42", "/products?id=42", "/products/42/edit"]
    answer: 1
  - question: Was bewirkt `withComponentInputBinding()`?
    options:
      - Inputs werden automatisch gespeichert
      - Route- und Query-Parameter kommen als Inputs in der Komponente an
      - Alle Komponenten bekommen eine id
      - Es aktiviert Lazy Loading
    answer: 1
  - question: "Welchen Typ hat der Parameter `:id` in der URL zunächst?"
    options: [number, string, boolean, Es hängt von der Route ab]
    answer: 1
    explanation: "URLs bestehen aus Text – mit `transform: numberAttribute` wird daraus eine Zahl."
exercise:
  example: ex-params
  title: Eine Bücher-Detailseite
  task: |-
    Die Bücherliste zeigt Titel, aber die Detailseite ist nicht erreichbar.

    1. Ergänze in `app.config.ts` die Route `'books/:id'` für `BookDetail`.
    2. Sorge dafür, dass Route-Parameter als Inputs ankommen (`withComponentInputBinding()`). `BookDetail` hat schon ein Input `id`.
    3. Verlinke in `book-list.ts` jeden Titel auf `/books/<id>`.
  checks:
    list-links: Ein Klick auf **Dune** führt zu `/books/2`
    detail-from-param: "`/books/3` zeigt **Neuromancer**"
    unknown-id: "`/books/99` zeigt **Book not found**"
---

# Parameter und Query-Parameter

Eine Detailseite pro Produkt anzulegen wäre absurd. Stattdessen gibt es **eine** Route mit einem Platzhalter – und die Komponente liest aus der URL, welches Produkt gemeint ist.

## Route-Parameter

Ein Doppelpunkt markiert einen Parameter:

```ts
const routes: Routes = [
  { path: 'products', component: ProductList },
  { path: 'products/:id', component: ProductDetail }, // /products/1, /products/2, …
];
```

## Parameter als Input empfangen

Mit `withComponentInputBinding()` kommen Parameter direkt als **Inputs** in der Komponente an:

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

Der Name des Inputs muss zum Namen des Parameters passen – `:id` → `id`. Weil URLs aus Text bestehen, wandelt `numberAttribute` den Wert in eine Zahl um.

> [!TIP]
> Wechselt der Nutzer von `/products/1` direkt zu `/products/2`, verwendet Angular dieselbe Komponente weiter und ändert nur das Input. Weil `product` ein `computed()` ist, passt sich die Anzeige automatisch an.

## Links mit Parametern

`routerLink` nimmt auch ein Array – die Teile werden zur URL zusammengesetzt:

```html
<a [routerLink]="['/products', p.id]">{{ p.name }}</a>
```

## Query-Parameter

Für optionale Angaben wie Sortierung oder Filter gibt es Query-Parameter: `/products?sort=price`. Sie brauchen keine eigene Route und kommen mit `withComponentInputBinding()` ebenfalls als Input an:

```html
<a routerLink="." [queryParams]="{ sort: 'price' }">nach Preis</a>
```

```ts
readonly sort = input<string>(); // aus ?sort=…
```

## Navigieren aus dem Code

Manchmal soll nicht ein Link, sondern der Code navigieren – etwa nach dem Speichern eines Formulars:

```ts
private readonly router = inject(Router);

save(): void {
  // … speichern …
  this.router.navigate(['/products']);
}
```

::tryit{routing-params}

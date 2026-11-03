---
title: Architektur
minutes: 9
quiz:
  - question: Was zeichnet eine präsentationale Komponente aus?
    options:
      - Sie lädt ihre Daten selbst vom Server
      - Sie bekommt Daten über Inputs und meldet Aktionen über Outputs – ohne Services zu kennen
      - Sie enthält das Routing
      - Sie darf keine Styles haben
    answer: 1
  - question: Wo gehört Zustand hin, den mehrere Komponenten teilen?
    options:
      - In eine globale Variable
      - In einen Service mit Signals
      - In die Komponente, die zuerst geladen wird
      - In `localStorage`
    answer: 1
  - question: Wie ordnest du die Dateien einer wachsenden App am besten?
    options:
      - Nach Typ – alle Komponenten in einen Ordner, alle Services in einen anderen
      - Nach Feature – alles zu „Produkte“ in einen Ordner, alles zum „Warenkorb“ in einen anderen
      - Alles in einen Ordner
      - Alphabetisch
    answer: 1
exercise:
  example: ex-architecture
  title: Eine App aufteilen
  task: |-
    Die ganze App steckt in einer Komponente. Teile sie auf:

    1. `CartStore`: Verschiebe `items`, `count`, `total` und `add()` aus `App` in den Service.
    2. `ProductCard`: eine präsentationale Komponente mit `input.required<Product>()` und `output()` namens `add`, mit dem Template einer Karte.
    3. `CartBadge`: zeigt „🛒 2 items · €284.00“ an und liest die Werte aus `CartStore`.
    4. `App` nutzt `<app-cart-badge />` und `<app-product-card>` und hat keinen eigenen Warenkorb-Zustand mehr.
  checks:
    product-cards: "Es gibt drei `<app-product-card>`"
    card-adds-to-cart: Der Button einer Karte legt das Produkt in den Warenkorb
    badge-total: Das Badge zeigt Anzahl und Summe
---

# Architektur

Kleine Apps funktionieren fast mit jeder Struktur. Wächst eine App aber auf Dutzende Seiten und mehrere Entwickler, entscheidet die Architektur darüber, ob neue Features leicht oder mühsam sind. Ein paar Regeln haben sich bewährt.

## Ordner nach Feature

Ordne Dateien nach **fachlichem Bereich**, nicht nach technischem Typ:

```
src/app/
  products/
    product.ts            ← Typ
    product-card.ts       ← präsentational
    product-list.ts       ← Container
    product.routes.ts     ← Lazy Route des Features
  cart/
    cart-store.ts         ← Zustand
    cart-badge.ts
  shared/
    ui/button.ts          ← wirklich überall genutzt
```

Alles, was zu einem Feature gehört, liegt beisammen. Ein Feature lässt sich so als Ganzes lazy laden, verschieben oder löschen. Nach `shared/` kommt nur, was mehrere Features wirklich brauchen.

## Container und präsentationale Komponenten

Ein bewährtes Muster teilt Komponenten in zwei Rollen:

- **Präsentationale Komponenten** zeigen nur an. Daten bekommen sie über `input()`, Aktionen melden sie über `output()`. Sie kennen keine Services und lassen sich deshalb überall wiederverwenden und leicht testen.
- **Container** wissen, woher die Daten kommen und was bei einer Aktion passiert. Sie injizieren Services und reichen die Daten nach unten weiter.

```ts
// präsentational
export class ProductCard {
  readonly product = input.required<Product>();
  readonly add = output();
}
```

```html
<!-- Container -->
@for (product of products; track product.id) {
  <app-product-card [product]="product" (add)="cart.add(product)" />
}
```

::tryit{architecture}

## Zustand in Services

Zustand, den mehrere Komponenten brauchen, gehört in einen **Service mit Signals**, oft *Store* genannt:

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

- Das Signal `items` ist `private`. Ändern kann es nur der Store selbst, über Methoden mit sprechenden Namen.
- Nach außen gibt es nur lesbare Werte, meist `computed()`.
- Komponenten wie `CartBadge` injizieren den Store und lesen daraus. Durchreichen über viele Ebenen entfällt.

> [!TIP]
> Für sehr große Apps gibt es Bibliotheken wie **NgRx SignalStore**, die dieses Muster mit fertigen Bausteinen umsetzen. Das Prinzip bleibt dasselbe: Zustand an einer Stelle, Änderungen nur über klar benannte Methoden.

## Geschafft!

Du kennst jetzt die wichtigsten Bausteine von Angular: Komponenten und Templates, Signals, Kommunikation zwischen Komponenten, Direktiven und Pipes, Services und DI, Routing, Formulare, HTTP, RxJS, Testing und die fortgeschrittenen Themen dieses Kapitels.

Der beste nächste Schritt ist ein eigenes Projekt. Starte mit `ng new`, nimm dir eine kleine Idee vor und baue sie Stück für Stück. Wenn du nicht weiterweißt, findest du hier jede Lektion über die Suche wieder (<kbd>Strg</kbd>+<kbd>K</kbd>).

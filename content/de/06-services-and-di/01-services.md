---
title: Services und inject()
minutes: 9
quiz:
  - question: "Was bewirkt `providedIn: 'root'`?"
    options:
      - Jede Komponente bekommt ihre eigene Instanz
      - Es gibt genau eine Instanz für die ganze App
      - Der Service ist nur in app.ts verfügbar
      - Der Service wird bei jedem Aufruf neu erstellt
    answer: 1
  - question: Wie holt sich eine Komponente einen Service?
    options: ["`new CartService()`", "`inject(CartService)`", "`CartService.getInstance()`", "`import { cart } from './cart'`"]
    answer: 1
    explanation: Mit `inject()` übernimmt Angular das Erzeugen – und alle bekommen dieselbe Instanz.
  - question: Warum gibt der CartService nach außen nur ein schreibgeschütztes Signal heraus?
    options:
      - Weil Signals nicht anders exportiert werden können
      - Damit Änderungen nur über die Methoden des Service laufen
      - Weil es schneller ist
      - Damit das Template nicht darauf zugreifen kann
    answer: 1
exercise:
  example: ex-service
  title: Favoriten für alle
  task: |-
    Die Produktliste und der Kopfbereich sollen dieselben Favoriten kennen.

    1. Lege in `favorites.service.ts` einen `FavoritesService` mit `providedIn: 'root'` an: ein privates Signal mit den Produktnamen, `toggle(name)`, `isFavorite(name)` und ein `computed()` `count`.
    2. Injiziere ihn in `ProductList`: Der Button schaltet den Favoriten um und setzt `aria-pressed`.
    3. Injiziere ihn in `App` und zeige `count()` in `#fav-count` an.
  checks:
    adds-favorite: Ein Klick auf **♥ Mug** zeigt oben **1**
    counts-several: Ein zweiter Favorit erhöht auf **2**
    toggles-off: Ein zweiter Klick auf **♥ Mug** entfernt ihn wieder, und `aria-pressed` stimmt
---

# Services und inject()

Bisher lebte aller Zustand in Komponenten. Das wird schnell eng: Die Produktliste fügt etwas in den Warenkorb, der Kopfbereich soll die Anzahl anzeigen, die Kasse die Summe. Über Inputs und Outputs müsste der Warenkorb durch viele Ebenen gereicht werden.

Ein **Service** ist eine Klasse, die Zustand und Logik bündelt, die mehrere Komponenten brauchen. Angular erzeugt ihn und gibt ihn jeder Komponente, die danach fragt – das nennt sich **Dependency Injection** (DI).

## Ein Service

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

- `@Injectable({ providedIn: 'root' })` meldet den Service beim **Root-Injector** an: Es gibt genau **eine** Instanz für die ganze App.
- `asReadonly()` gibt das Signal nur lesend heraus. Ändern geht nur über die Methoden des Service – so bleibt nachvollziehbar, wer was ändert.

> [!NOTE]
> Ab Angular 22 gibt es dafür die Kurzform `@Service()`. Sie bedeutet dasselbe wie `@Injectable({ providedIn: 'root' })`. Die Live-Beispiele laufen auf Angular 21 und verwenden deshalb die längere Schreibweise.

## Einen Service verwenden

Mit `inject()` holt sich eine Komponente den Service:

```ts
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-cart-summary',
  template: `<p>Summe: {{ cart.total() }} €</p>`,
})
export class CartSummary {
  protected readonly cart = inject(CartService);
}
```

Eine zweite Komponente, die ebenfalls `inject(CartService)` aufruft, bekommt **dieselbe Instanz**. Fügt die Produktliste etwas hinzu, sieht die Zusammenfassung es sofort – ohne dass die beiden Komponenten voneinander wissen.

::tryit{services-cart}

## Wo inject() erlaubt ist

`inject()` funktioniert nur in einem **Injection Context**: als Feld-Initialisierung oder im Konstruktor von Komponenten, Direktiven, Pipes und Services.

```ts
export class CartSummary {
  private readonly cart = inject(CartService); // ✅ Feld

  constructor() {
    const logger = inject(Logger);              // ✅ Konstruktor
  }

  onClick(): void {
    inject(CartService);                        // ❌ Fehler NG0203
  }
}
```

> [!TIP]
> Schreib nie `new CartService()`. Dann hättest du eine zweite, unabhängige Instanz – und die Komponenten würden nicht mehr denselben Warenkorb sehen.

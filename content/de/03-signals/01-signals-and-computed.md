---
title: signal() und computed()
minutes: 10
quiz:
  - question: Wie änderst du den Wert eines Signals basierend auf dem aktuellen Wert?
    options: ["count = count + 1", "count.set(count + 1)", "count.update(n => n + 1)", "count.mutate(n => n++)"]
    answer: 2
    explanation: "`update()` bekommt den aktuellen Wert und gibt den neuen zurück."
  - question: Was gilt für ein computed()-Signal?
    options:
      - Man kann es mit set() überschreiben
      - Es wird bei jedem Change-Detection-Lauf neu berechnet
      - Es wird nur neu berechnet, wenn sich eines seiner Signals geändert hat
      - Es funktioniert nur im Template
    answer: 2
    explanation: computed() ist schreibgeschützt, lazy und gecacht. Es rechnet nur neu, wenn sich seine Abhängigkeiten ändern.
exercise:
  example: ex-signals-counter
  title: Quadrat und Reset
  task: |
    Der Zähler im Startprojekt funktioniert schon. Erweitere ihn:

    1. Lege ein `computed()`-Signal `squared` an, das das Quadrat von `count` berechnet, und zeige es in einem Element mit `id="squared"` an – zum Beispiel `<p id="squared">Squared: …</p>`.
    2. Füge einen Button mit dem Text **Reset** hinzu, der den Zähler auf 0 zurücksetzt.
  checks:
    squared-shown: Ein Element mit `id="squared"` zeigt das Quadrat an
    squared-updates: Nach dreimal **+** zeigt es 9
    reset: "**Reset** setzt Zähler und Quadrat auf 0"
---

# signal() und computed()

**Signals** sind das Herzstück der Reaktivität in Angular. Ein Signal ist ein Behälter für einen Wert und meldet Angular automatisch, wenn sich dieser Wert ändert. So weiß Angular genau, welche Teile der Oberfläche aktualisiert werden müssen.

## Ein Signal erstellen und lesen

```ts
import { signal } from '@angular/core';

const count = signal(0);

console.log(count()); // 0 – lesen durch Aufrufen
```

## Werte ändern

```ts
count.set(5);               // Wert direkt setzen
count.update((n) => n + 1); // neuen Wert aus dem alten berechnen
```

> [!WARNING]
> Ändere Objekte oder Arrays in einem Signal nie direkt (z. B. mit `push`). Erzeuge stattdessen eine neue Kopie: `todos.update((list) => [...list, neu])`. Nur so erkennt Angular die Änderung.

## Abgeleitete Werte mit computed()

Mit `computed()` definierst du Werte, die sich aus anderen Signals ergeben:

```ts
import { computed, signal } from '@angular/core';

const count = signal(3);
const doubled = computed(() => count() * 2);

console.log(doubled()); // 6
count.set(10);
console.log(doubled()); // 20
```

Ein `computed()`-Signal

- erkennt **automatisch**, welche Signals es liest,
- ist **schreibgeschützt** (kein `set()` oder `update()`),
- rechnet nur neu, wenn sich eine Abhängigkeit geändert hat, und speichert das Ergebnis.

## Signals in Komponenten

```ts
@Component({
  selector: 'app-root',
  template: `
    <h1>Zähler: {{ count() }}</h1>
    <p>Doppelt: {{ doubled() }}</p>
    <button (click)="increment()">+</button>
  `,
})
export class App {
  protected readonly count = signal(0);
  protected readonly doubled = computed(() => this.count() * 2);

  protected increment(): void {
    this.count.update((n) => n + 1);
  }
}
```

::tryit{signals-counter}

> [!TIP]
> Ergänze im Beispiel ein `computed()`-Signal `squared`, das das Quadrat des Zählers berechnet, und zeige es im Template an.

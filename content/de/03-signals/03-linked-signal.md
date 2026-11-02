---
title: Abhängiger Zustand mit linkedSignal()
minutes: 7
quiz:
  - question: Was unterscheidet linkedSignal() von computed()?
    options:
      - linkedSignal() ist schneller
      - linkedSignal() kann man zusätzlich mit set() und update() ändern
      - linkedSignal() funktioniert nur mit Arrays
      - Es gibt keinen Unterschied
    answer: 1
  - question: Was passiert mit einem linkedSignal, wenn sich seine Quelle ändert?
    options:
      - Nichts, es behält seinen Wert
      - Es wird zerstört
      - Es wird mit der computation-Funktion neu berechnet
      - Es wirft einen Fehler
    answer: 2
---

# Abhängiger Zustand mit linkedSignal()

Stell dir eine Produktauswahl vor: Der Nutzer wählt ein Produkt und dann eine Größe. Wechselt er das Produkt, soll die Größe auf einen gültigen Wert zurückspringen. Trotzdem muss er die Größe selbst ändern können.

- `computed()` passt nicht, denn es ist schreibgeschützt.
- `signal()` plus `effect()` funktioniert, ist aber umständlich und fehleranfällig.

Für genau diesen Fall gibt es `linkedSignal()`: ein **beschreibbares Signal, das sich zurücksetzt, wenn sich seine Quelle ändert**.

## Die Kurzform

```ts
import { linkedSignal, signal } from '@angular/core';

const options = signal(['Rot', 'Grün', 'Blau']);
const selected = linkedSignal(() => options()[0]);

console.log(selected()); // 'Rot'
selected.set('Blau');     // Nutzer wählt selbst
console.log(selected()); // 'Blau'

options.set(['Gelb', 'Lila']);
console.log(selected()); // 'Gelb' – zurückgesetzt, weil sich options geändert hat
```

## Die ausführliche Form mit previous

Oft willst du die bisherige Auswahl behalten, wenn sie noch gültig ist. Dafür gibst du `source` und `computation` an. Die Funktion bekommt den neuen Wert der Quelle und den vorherigen Zustand:

```ts
protected readonly product = signal('T-Shirt');

protected readonly size = linkedSignal<string, string>({
  source: this.product,
  computation: (product, previous) => {
    const sizes = SIZES[product];
    // Bisherige Größe behalten, wenn das neue Produkt sie auch hat
    return previous && sizes.includes(previous.value) ? previous.value : sizes[0];
  },
});
```

`previous` enthält `previous.source` (die alte Quelle) und `previous.value` (den alten Wert, auch wenn er per `set()` gesetzt wurde). Beim ersten Aufruf ist `previous` `undefined`.

::tryit{linked-signal}

> [!TIP]
> Wähle im Beispiel beim T-Shirt die Größe „L“ und wechsle zum Hoodie: Die Größe bleibt erhalten. Bei den Schuhen gibt es kein „L“, deshalb springt die Auswahl auf die erste Größe.

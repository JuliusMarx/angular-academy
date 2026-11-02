---
title: Nebeneffekte mit effect()
minutes: 8
quiz:
  - question: Wann läuft ein effect() erneut?
    options:
      - Bei jedem Klick auf der Seite
      - Wenn sich eines der Signals ändert, die er beim letzten Lauf gelesen hat
      - Nur ein einziges Mal beim Start
      - Jede Sekunde
    answer: 1
  - question: Wofür ist effect() gedacht?
    options:
      - Um abgeleitete Werte zu berechnen
      - Um Signals mit anderen Signals synchron zu halten
      - Um auf Änderungen mit Nebeneffekten zu reagieren, z. B. Speichern oder Logging
      - Um HTTP-Anfragen zu cachen
    answer: 2
    explanation: Für abgeleitete Werte nimmst du `computed()`, für abhängigen, beschreibbaren Zustand `linkedSignal()`.
  - question: Wo darf effect() aufgerufen werden?
    options:
      - Überall, auch in normalen Funktionen
      - Nur im Template
      - In einem Injection Context, z. B. im Konstruktor oder als Feld-Initialisierung
      - Nur in main.ts
    answer: 2
---

# Nebeneffekte mit effect()

`computed()` berechnet Werte. Manchmal willst du aber auf eine Änderung **reagieren**, zum Beispiel einen Wert speichern, etwas loggen oder eine Bibliothek außerhalb von Angular aktualisieren. Dafür gibt es `effect()`.

## Ein erster Effect

```ts
import { Component, effect, signal } from '@angular/core';

@Component({ /* … */ })
export class Notes {
  protected readonly note = signal(localStorage.getItem('note') ?? '');

  constructor() {
    effect(() => {
      localStorage.setItem('note', this.note());
    });
  }
}
```

Ein Effect

- läuft **mindestens einmal**,
- merkt sich, welche Signals er gelesen hat,
- läuft **erneut**, wenn sich eines davon ändert.

Angular fasst mehrere Änderungen zusammen: Setzt du ein Signal dreimal hintereinander, läuft der Effect danach nur einmal.

## Aufräumen mit onCleanup

Startet ein Effect etwas, das weiterläuft (Timer, Abos), räumst du es mit `onCleanup` auf. Die Funktion wird aufgerufen, bevor der Effect erneut läuft oder die Komponente zerstört wird:

```ts
effect((onCleanup) => {
  const text = this.note();
  const timer = setTimeout(() => console.log('Geändert:', text), 300);
  onCleanup(() => clearTimeout(timer));
});
```

So entsteht nebenbei ein einfaches *Debounce*: Es wird nur geloggt, wenn 300 ms lang nichts getippt wurde.

## Wo effect() erlaubt ist

`effect()` braucht einen **Injection Context**. Das heißt: im Konstruktor oder direkt als Feld einer Komponente oder eines Services. Wird die Komponente zerstört, beendet Angular ihre Effects automatisch.

::tryit{signals-effect}

> [!WARNING]
> Verwende `effect()` nicht, um ein Signal aus einem anderen abzuleiten. Statt `effect(() => this.total.set(this.a() + this.b()))` schreibst du `total = computed(() => this.a() + this.b())`. Das ist einfacher, schneller und vermeidet Zwischenzustände.

> [!TIP]
> Brauchst du in einem Effect den Wert eines Signals, ohne davon abhängig zu werden, liest du es mit `untracked(() => this.user())`.

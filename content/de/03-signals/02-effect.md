---
title: Nebeneffekte mit effect()
minutes: 8
summary: |-
  - `effect()` reagiert auf Änderungen mit Nebeneffekten, z. B. Speichern, Logging oder eine Bibliothek außerhalb von Angular aktualisieren.
  - Ein Effect läuft mindestens einmal, merkt sich die gelesenen Signals und läuft erneut, wenn sich eines davon ändert. Mehrere Änderungen fasst Angular zusammen.
  - Mit `onCleanup` räumst du Timer oder Abos auf, bevor der Effect erneut läuft oder die Komponente zerstört wird.
  - `effect()` braucht einen Injection Context: im Konstruktor oder als Feld. Angular beendet Effects automatisch mit der Komponente.
  - Mit `untracked(() => this.user())` liest du ein Signal, ohne davon abhängig zu werden.

  ```ts
  constructor() {
    effect(() => {
      localStorage.setItem('note', this.note());
    });
  }
  ```

  > [!WARNING] Leite mit `effect()` keine Signals ab. Statt `effect(() => this.total.set(this.a() + this.b()))` schreibst du `total = computed(() => this.a() + this.b())`.
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
exercise:
  example: ex-effect
  title: Entwurf automatisch speichern
  task: 'Der Text im Eingabefeld soll nicht verloren gehen. Lege im Konstruktor einen `effect()` an, der den Entwurf bei jeder Änderung mit `localStorage.setItem(''draft'', …)` speichert.'
  checks:
    saves-draft: Getippter Text landet unter dem Schlüssel `draft` im localStorage
    saves-changes: Auch spätere Änderungen werden gespeichert
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

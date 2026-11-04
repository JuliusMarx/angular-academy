---
title: Kind-Elemente abfragen mit viewChild()
minutes: 8
summary: |-
  - `viewChild('search')` greift auf ein Element mit `#search` im eigenen Template zu und liefert ein Signal.
  - Bei HTML-Elementen bekommst du eine `ElementRef`, das DOM-Element steckt in `nativeElement`. Mit einer Komponenten-Klasse bekommst du die Instanz.
  - Ohne `.required` ist der Wert `undefined`, solange das Element nicht existiert.
  - `viewChildren()` liefert alle Treffer als Liste und aktualisiert sich, wenn `@for` Einträge ändert.
  - Für projizierte Inhalte gibt es `contentChild()` und `contentChildren()`.
  - Nutze Queries sparsam – Inputs, Outputs und Bindings sind meist einfacher.

  ```ts
  private readonly search = viewChild.required<ElementRef<HTMLInputElement>>('search');

  constructor() {
    afterNextRender(() => this.search().nativeElement.focus());
  }
  ```

  > [!WARNING] Die Query ist erst nach dem Rendern gefüllt, im Konstruktor ist sie noch leer. Greife in `afterNextRender()`, in Event-Handlern oder in einem `effect()` darauf zu.
quiz:
  - question: "Was liefert viewChild('search') für <input #search />?"
    options:
      - Den Text im Eingabefeld
      - Ein Signal mit einer ElementRef auf das input-Element
      - Ein Observable
      - Das input-Element direkt, ohne Signal
    answer: 1
  - question: Ab wann ist eine View-Query gefüllt?
    options:
      - Schon im Konstruktor
      - Erst nachdem die Ansicht gerendert wurde
      - Nur wenn man sie manuell lädt
      - Nur im Template
    answer: 1
    explanation: Greife in `afterNextRender()`, in Event-Handlern oder in einem `effect()` darauf zu.
  - question: Wofür ist contentChild() gedacht?
    options:
      - Für Elemente im eigenen Template
      - Für Elemente, die per ng-content in die Komponente projiziert wurden
      - Für Kind-Routen
      - Für Elemente in einer anderen Komponente auf der Seite
    answer: 1
---

# Kind-Elemente abfragen mit viewChild()

Meistens reichen Inputs, Outputs und Bindings. Manchmal braucht die Klasse aber direkten Zugriff auf ein Element oder eine Kind-Komponente: um ein Eingabefeld zu fokussieren, ein Video zu starten oder alle Einträge einer Liste aufzuklappen. Dafür gibt es **View-Queries**.

## Ein Element abfragen

In der Lektion über Template-Variablen hast du `#name` kennengelernt. Mit `viewChild()` greifst du aus der Klasse darauf zu:

```ts
import { afterNextRender, Component, ElementRef, viewChild } from '@angular/core';

@Component({
  selector: 'app-search',
  template: `<input #search placeholder="Suchen …" />`,
})
export class Search {
  private readonly search = viewChild.required<ElementRef<HTMLInputElement>>('search');

  constructor() {
    afterNextRender(() => this.search().nativeElement.focus());
  }
}
```

- `viewChild()` liefert ein **Signal**. Ohne `.required` ist der Wert `undefined`, solange das Element nicht existiert – etwa in einem `@if`, das gerade `false` ist.
- Bei einem HTML-Element bekommst du eine `ElementRef`. Das echte DOM-Element steckt in `nativeElement`.

> [!WARNING]
> Die Query ist erst gefüllt, **nachdem die Ansicht gerendert wurde**. Im Konstruktor ist sie noch leer. Greife in `afterNextRender()`, in Event-Handlern oder in einem `effect()` darauf zu.

## Komponenten abfragen

Statt eines Namens kannst du auch eine Komponenten-Klasse angeben. Dann bekommst du die **Instanz** und kannst ihre öffentlichen Eigenschaften und Methoden nutzen:

```ts
readonly player = viewChild.required(VideoPlayer);

play(): void {
  this.player().start();
}
```

## Mehrere Treffer mit viewChildren()

`viewChildren()` liefert alle Treffer als Liste – und aktualisiert sich automatisch, wenn `@for` Einträge hinzufügt oder entfernt:

```ts
protected readonly items = viewChildren(FaqItem);
protected readonly openCount = computed(() => this.items().filter((i) => i.open()).length);

expandAll(): void {
  for (const item of this.items()) item.open.set(true);
}
```

::tryit{view-queries}

> [!TIP]
> Filtere im Beispiel nach „signal“, klappe alle auf und lösche den Filter wieder: Nur ein Eintrag ist noch offen. Die ausgeblendeten Komponenten wurden zerstört und neu erzeugt – ihr Zustand ist dabei verloren gegangen.

## Projizierte Inhalte: contentChild()

`viewChild()` findet nur Elemente aus dem **eigenen Template**. Für Inhalte, die per `<ng-content>` hineinkommen, gibt es `contentChild()` und `contentChildren()`:

```ts
@Component({
  selector: 'app-tabs',
  template: `<ng-content />`,
})
export class Tabs {
  readonly tabs = contentChildren(Tab); // alle <app-tab> zwischen <app-tabs> und </app-tabs>
}
```

> [!NOTE]
> Nutze Queries sparsam. Wenn sich etwas mit einem Input, Output oder Binding lösen lässt, ist das fast immer einfacher zu verstehen und zu testen.

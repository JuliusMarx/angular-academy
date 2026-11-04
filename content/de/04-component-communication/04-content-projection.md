---
title: Inhalte projizieren mit ng-content
minutes: 8
summary: |-
  - Mit Content Projection übergibst du einer Komponente ganzes Markup statt nur Daten.
  - `<ng-content />` ist ein Platzhalter für alles zwischen dem öffnenden und schließenden Tag der Komponente.
  - Mit `select` (Attribut, Element oder CSS-Klasse) verteilst du Inhalte auf mehrere Slots. Alles Übrige landet im `<ng-content />` ohne `select`.
  - Inhalt zwischen `<ng-content>` und `</ng-content>` ist ein Fallback, falls für den Slot nichts übergeben wurde.
  - Projizierte Elemente gehören zum Template der Eltern-Komponente – deshalb gelten deren Styles.

  ```html
  <section>
    <header><ng-content select="[card-title]" /></header>
    <div class="body"><ng-content /></div>
    <footer>
      <ng-content select="[card-footer]"><small>Keine Aktionen</small></ng-content>
    </footer>
  </section>
  ```

  > [!WARNING] `<ng-content>` kann nicht bedingt oder mehrfach gerendert werden. In `@if` oder `@for` zeigt es den Inhalt höchstens einmal, erzeugt wird er immer.
quiz:
  - question: Wo landet projizierter Inhalt, der zu keinem select passt?
    options:
      - Er wird verworfen
      - Im ersten ng-content mit select
      - Im ng-content ohne select (Standard-Slot)
      - Am Ende der Komponente
    answer: 2
  - question: Welche Komponente ist für das Styling von projiziertem Inhalt zuständig?
    options:
      - Die Komponente mit dem ng-content
      - Die Komponente, in deren Template der Inhalt geschrieben steht
      - Nur globale Styles
      - Keine – projizierter Inhalt kann nicht gestylt werden
    answer: 1
    explanation: Projizierte Elemente gehören zum Template der Eltern-Komponente – deshalb gelten deren gekapselte Styles.
  - question: Wann wird der Inhalt innerhalb von <ng-content>…</ng-content> angezeigt?
    options:
      - Immer
      - Nur wenn für diesen Slot nichts projiziert wurde
      - Nur im Entwicklungsmodus
      - Nie, er ist nur ein Kommentar
    answer: 1
exercise:
  example: ex-projection
  title: Ein Hinweis mit Titel
  task: |-
    Die Alerts in `app.ts` übergeben Inhalte, aber `Alert` zeigt sie noch nicht an.

    1. Projiziere Elemente mit dem Attribut `alert-title` in den Titelbereich. Ist keins vorhanden, zeige den Fallback-Text **Note**.
    2. Projiziere alles andere in den Textbereich.
  checks:
    title-slot: Der erste Alert zeigt **Heads up!** im Titelbereich
    body-slot: Der Text steht im Textbereich – und der Titel nicht noch einmal
    fallback-title: Der zweite Alert zeigt den Fallback-Titel **Note**
---

# Inhalte projizieren mit ng-content

Mit Inputs gibst du einer Komponente **Daten**. Manchmal willst du ihr aber ganzes **Markup** übergeben: Eine Karte soll einen Rahmen, eine Kopfzeile und einen Fußbereich liefern – was darin steht, entscheidet jede Verwendung selbst. Das nennt sich **Content Projection**.

## Ein einfacher Slot

```ts
@Component({
  selector: 'app-card',
  template: `
    <section class="card">
      <ng-content />
    </section>
  `,
})
export class Card {}
```

```html
<app-card>
  <h2>Willkommen</h2>
  <p>Alles zwischen den Tags landet im ng-content.</p>
</app-card>
```

`<ng-content />` ist ein Platzhalter: Angular setzt dort alles ein, was zwischen `<app-card>` und `</app-card>` steht.

## Mehrere Slots mit select

Mit `select` legst du fest, welcher Inhalt in welchen Slot kommt. Du kannst nach Attribut, Element oder CSS-Klasse auswählen:

```html
<section>
  <header><ng-content select="[card-title]" /></header>
  <div class="body"><ng-content /></div>
  <footer><ng-content select="[card-footer]" /></footer>
</section>
```

```html
<app-card>
  <h2 card-title>Angular Academy</h2>
  <p>Landet im Standard-Slot.</p>
  <button card-footer>Loslegen</button>
</app-card>
```

Alles, was zu keinem `select` passt, landet im `<ng-content />` **ohne** `select`.

## Fallback-Inhalt

Was zwischen `<ng-content>` und `</ng-content>` steht, wird angezeigt, wenn für diesen Slot nichts übergeben wurde:

```html
<footer>
  <ng-content select="[card-footer]">
    <small>Keine Aktionen</small>
  </ng-content>
</footer>
```

::tryit{content-projection}

## Wer stylt was?

Projizierte Elemente gehören zum Template der **Eltern-Komponente**. Deshalb gelten für sie deren Styles – nicht die der Karte:

```ts
@Component({
  selector: 'app-root',
  template: `<app-card><h2 card-title>…</h2></app-card>`,
  styles: `h2 { margin: 0; }`, // greift auf das projizierte h2
})
export class App {}
```

Die Karte selbst stylt ihren Rahmen: `section`, `header`, `footer`.

> [!WARNING]
> `<ng-content>` kann nicht bedingt oder mehrfach gerendert werden. Ein `<ng-content />` innerhalb von `@if` oder `@for` zeigt den Inhalt höchstens einmal – und er wird immer erzeugt, auch wenn er nicht sichtbar ist. Für solche Fälle gibt es Templates mit `ng-template`.

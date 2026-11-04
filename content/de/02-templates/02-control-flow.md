---
title: Control Flow mit @if, @for und @switch
minutes: 8
summary: |-
  - Control-Flow-Blöcke beginnen mit `@` und sind eingebaut. Du musst nichts importieren.
  - `@if` / `@else if` / `@else` zeigt Inhalte bedingt an; mit `as` speicherst du das Ergebnis der Bedingung in einer Variable.
  - `@for` gibt Listen aus. `track` ist Pflicht und sollte eine eindeutige ID sein.
  - `@empty` erscheint, wenn die Liste leer ist; in der Schleife gibt es `$index`, `$first`, `$last`, `$even` und `$odd`.
  - `@switch` mit `@case` und `@default` unterscheidet mehrere Fälle.

  ```html
  @for (todo of todos(); track todo.id) {
    <li>{{ $index + 1 }}. {{ todo.title }}</li>
  } @empty {
    <li>Keine Aufgaben vorhanden.</li>
  }
  ```

  > [!WARNING] Verwende `track $index` nur, wenn die Einträge keine eindeutige ID haben. Sonst wird beim Sortieren oder Löschen mehr neu gerendert als nötig.
quiz:
  - question: Was ist bei @for Pflicht?
    options: ["Ein @empty-Block", "Ein track-Ausdruck", "Ein Index ($index)", "Eine Sortierung"]
    answer: 1
    explanation: "`track` sagt Angular, wie es Einträge wiedererkennt. So werden bei Änderungen nur die betroffenen DOM-Elemente aktualisiert."
  - question: Welcher Block wird bei @for angezeigt, wenn die Liste leer ist?
    options: ["@else", "@default", "@empty", "@none"]
    answer: 2
exercise:
  example: ex-control-flow
  title: Eine Aufgabenliste
  task: |-
    Die Liste `<ul id="tasks">` ist noch leer. Fülle sie:

    1. Gib mit `@for` für jede Aufgabe ein `<li>` mit ihrem Titel aus. Vergiss `track` nicht.
    2. Ist die Liste leer, zeige `<li class="empty">No tasks</li>` – mit `@empty`.
  checks:
    renders-list: Die drei Aufgaben erscheinen als Listeneinträge
    add-works: Nach **Add** steht eine vierte Aufgabe in der Liste
    empty-state: Nach **Clear** erscheint **No tasks**
---

# Control Flow mit @if, @for und @switch

Mit **Control-Flow-Blöcken** steuerst du, *was* im Template angezeigt wird. Sie beginnen mit `@` und sind direkt in Angular eingebaut – du musst nichts importieren.

## @if – Bedingte Anzeige

```html
@if (user(); as u) {
  <p>Willkommen zurück, {{ u.name }}!</p>
} @else if (loading()) {
  <p>Wird geladen …</p>
} @else {
  <button (click)="login()">Anmelden</button>
}
```

Mit `as` speicherst du das Ergebnis der Bedingung in einer Variable – praktisch, wenn der Wert ein Objekt ist.

## @for – Listen ausgeben

```html
<ul>
  @for (todo of todos(); track todo.id) {
    <li>{{ $index + 1 }}. {{ todo.title }}</li>
  } @empty {
    <li>Keine Aufgaben vorhanden.</li>
  }
</ul>
```

- **`track`** ist Pflicht. Verwende eine eindeutige ID, damit Angular Einträge effizient wiederverwenden kann.
- **`@empty`** wird angezeigt, wenn die Liste leer ist.
- Innerhalb der Schleife stehen Variablen wie `$index`, `$first`, `$last`, `$even` und `$odd` zur Verfügung.

> [!WARNING]
> Verwende `track $index` nur, wenn die Einträge keine eindeutige ID haben. Beim Sortieren oder Löschen werden sonst mehr Elemente neu gerendert als nötig.

## @switch – Mehrere Fälle

```html
@switch (status()) {
  @case ('loading') { <p>Lädt …</p> }
  @case ('error') { <p>Fehler!</p> }
  @default { <p>Fertig.</p> }
}
```

::tryit{control-flow}

> [!TIP]
> Leere im Beispiel die Liste per Button – und ersetze danach das äußere `@if` durch einen `@empty`-Block.

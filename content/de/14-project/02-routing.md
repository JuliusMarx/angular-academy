---
title: Liste und Detailseite
minutes: 8
summary: |-
  - Die App wird zur **Shell**: `App` enthält nur noch Navigation, Zähler und `<router-outlet />`. Die Liste zieht in eine eigene Seite `TaskList`.
  - Routen: `tasks` für die Liste, `tasks/:id` für die Detailseite, `''` und `**` leiten auf `tasks` um.
  - Die Detailseite wird mit `loadComponent` erst geladen, wenn jemand sie öffnet.
  - Mit `withComponentInputBinding()` kommt `:id` als Input an: `id = input.required({ transform: numberAttribute })`.
  - Die Aufgabe ist ein `computed()` aus Store und id. Sie aktualisiert sich, wenn sich eins von beiden ändert. Gibt es die id nicht, zeigt die Seite „nicht gefunden“.
  - Links: `[routerLink]="['/tasks', task().id]"`. `routerLinkActive` mit `ariaCurrentWhenActive="page"` markiert den aktiven Link auch für Screenreader.
  - Kein Link in einem `<label>`: Die Checkbox bekommt ihren Namen dann per `aria-label`.

  ```ts
  { path: 'tasks/:id', loadComponent: () => import('./task-detail').then((m) => m.TaskDetail) }

  readonly id = input.required({ transform: numberAttribute });
  protected readonly task = computed(() => this.store.tasks().find((t) => t.id === this.id()));
  ```
quiz:
  - question: "Warum ist `task` in `TaskDetail` ein `computed()` und kein Wert, der einmal im Konstruktor gesucht wird?"
    options:
      - Weil Inputs im Konstruktor noch nicht gesetzt sind und sich id und Store später ändern können
      - Weil `find()` nur in `computed()` erlaubt ist
      - Weil der Router sonst keine Parameter liefert
      - Es gibt keinen Unterschied
    answer: 0
    explanation: "Ein `computed()` liest `id()` und `store.tasks()`. Wechselt die URL von `/tasks/2` auf `/tasks/3` oder hakst du die Aufgabe ab, rechnet es neu."
  - question: "Wozu dient `transform: numberAttribute` beim Input `id`?"
    options:
      - Es prüft, ob die Aufgabe existiert
      - Es wandelt den Text aus der URL in eine Zahl um, damit `t.id === this.id()` passt
      - Es macht den Input optional
      - Es lädt die Komponente lazy
    answer: 1
  - question: "Was bewirkt `loadComponent: () => import('./task-detail').then((m) => m.TaskDetail)`?"
    options:
      - Die Komponente wird bei jedem Aufruf neu kompiliert
      - Die Detailseite landet in einem eigenen Bundle und wird erst geladen, wenn jemand eine Aufgabe öffnet
      - Die Komponente wird vorab im Hintergrund gerendert
      - Die Route ist nur für angemeldete Nutzer
    answer: 1
  - question: "Warum hat die Checkbox in `TaskItem` jetzt ein `aria-label` statt eines umgebenden `<label>`?"
    options:
      - Weil `<label>` in Angular nicht erlaubt ist
      - Weil `aria-label` besser aussieht
      - Weil der Titel jetzt ein Link ist – und interaktive Elemente dürfen nicht in einem `<label>` stehen
      - Weil Checkboxen keinen Namen brauchen
    answer: 2
---

# Liste und Detailseite

Bisher zeigt die App nur eine Liste. Jetzt bekommt jede Aufgabe eine eigene Seite unter `/tasks/<id>`. Dafür wird `App` zur **Shell**, und die Seiten wechseln im `<router-outlet />`.

## Die Routen

```ts
const routes: Routes = [
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  { path: 'tasks', component: TaskList, title: 'Tasks' },
  { path: 'tasks/:id', loadComponent: () => import('./task-detail').then((m) => m.TaskDetail), title: 'Task' },
  { path: '**', redirectTo: 'tasks' },
];

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes, withComponentInputBinding())],
};
```

- Die **Liste** ist die Startseite und wird direkt geladen.
- Die **Detailseite** wird mit `loadComponent` **lazy** geladen: Sie kommt in ein eigenes Bundle, das der Browser erst holt, wenn jemand eine Aufgabe öffnet.
- `title` setzt den Titel des Browser-Tabs. Er erscheint im Verlauf und in Lesezeichen und verrät Screenreader-Nutzern, auf welcher Seite sie sind. Jede Route sollte einen haben.
- `**` fängt alle unbekannten URLs ab. Hier leitet es auf die Liste um, du könntest auch eine eigene 404-Seite zeigen.

## Die Shell

`App` enthält jetzt nur noch, was auf jeder Seite gleich ist:

```html
<header>
  <nav aria-label="Main">
    <a routerLink="/tasks" routerLinkActive="active" ariaCurrentWhenActive="page" [routerLinkActiveOptions]="{ exact: true }">
      Tasks
    </a>
  </nav>
  <p id="summary">{{ store.openCount() }} open</p>
</header>
<main>
  <router-outlet />
</main>
```

`routerLinkActive` setzt die Klasse `active` auf den Link der aktuellen Seite, `ariaCurrentWhenActive="page"` zusätzlich `aria-current="page"`. Sehende erkennen den aktiven Link an der Formatierung, Screenreader am Attribut. Mit `exact: true` gilt der Link nur auf `/tasks` selbst als aktiv, nicht auf `/tasks/2`.

Die Liste von vorher – samt Filter aus der Übung – zieht unverändert in die Komponente `TaskList`. Weil die Aufgaben im Store liegen und nicht in `App`, musste dafür nichts umgebaut werden.

## Die Detailseite

Dank `withComponentInputBinding()` kommt der Platzhalter `:id` als Input an. In der URL ist er Text, `numberAttribute` macht daraus eine Zahl:

```ts
export class TaskDetail {
  protected readonly store = inject(TaskStore);
  readonly id = input.required({ transform: numberAttribute });
  protected readonly task = computed(() => this.store.tasks().find((t) => t.id === this.id()));
}
```

```html
@if (task(); as task) {
  <h1>{{ task.title }}</h1>
  <p>{{ task.notes || 'No notes.' }}</p>
  <button type="button" (click)="store.toggle(task.id)">
    {{ task.done ? 'Mark as open' : 'Mark as done' }}
  </button>
} @else {
  <h1>Task not found</h1>
}
```

`task` ist ein `computed()` aus **zwei** Quellen: der id aus der URL und den Aufgaben im Store. Klickst du auf „Mark as done“, ändert sich der Store, und Detailseite, Liste und Zähler im Kopf aktualisieren sich gemeinsam.

> [!TIP]
> Rechne immer damit, dass eine id nicht existiert – jemand kann jede beliebige URL eintippen. Der `@else`-Zweig zeigt dann eine verständliche Meldung statt einer leeren Seite.

## Links in der Liste

Jede Aufgabe verlinkt auf ihre Seite:

```html
<input type="checkbox" [checked]="task().done" [attr.aria-label]="'Done: ' + task().title" (change)="toggled.emit()" />
<a [routerLink]="['/tasks', task().id]">{{ task().title }}</a>
```

Vorher stand der Titel im `<label>` der Checkbox. Ein Link darf aber nicht in einem `<label>` stehen: Ein Klick wäre dann gleichzeitig „Link öffnen“ und „Checkbox umschalten“. Deshalb bekommt die Checkbox ihren Namen jetzt per `aria-label`, etwa „Done: Plan the project“.

::tryit{project-routing}

Öffne eine Aufgabe, ändere ihren Status und geh zurück zur Liste. Probiere auch eine id, die es nicht gibt, indem du die URL in der Vorschau änderst.

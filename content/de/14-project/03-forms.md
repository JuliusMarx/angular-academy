---
title: Aufgaben anlegen mit Signal Forms
minutes: 9
summary: |-
  - Neue Route `tasks/new` für das Formular. Sie muss **vor** `tasks/:id` stehen, sonst passt `:id` auf „new“.
  - Das Formular bearbeitet einen `TaskDraft` (Titel und Notizen) – id und Status vergibt der Store.
  - `form(model, (path) => { … })` bekommt die Regeln als Schema: `required`, `minLength`, `maxLength`, jeweils mit `message`.
  - `submit(form, action)` markiert alle Felder als berührt und führt die Aktion nur aus, wenn das Formular gültig ist.
  - Die Aktion legt die Aufgabe im Store an (`add()` gibt sie mit ihrer neuen id zurück) und navigiert mit `router.navigate(['/tasks', task.id])` zur Detailseite.
  - Fehler erst nach dem Berühren zeigen und per `aria-describedby` mit dem Feld verbinden. Jedes Feld braucht ein sichtbares `<label>`.

  ```ts
  protected readonly taskForm = form(this.model, (path) => {
    required(path.title, { message: 'Please enter a title.' });
    minLength(path.title, 3, { message: 'At least 3 characters.' });
    maxLength(path.title, 80, { message: 'At most 80 characters.' });
  });
  ```
quiz:
  - question: "Die Routen stehen in der Reihenfolge `tasks/:id`, dann `tasks/new`. Was passiert beim Aufruf von `/tasks/new`?"
    options:
      - Das Formular erscheint, der Router nimmt immer die genaueste Route
      - Der Router nimmt die erste passende Route `tasks/:id` – die Detailseite sucht eine Aufgabe mit der id „new“
      - Angular meldet beim Start einen Fehler
      - Beide Seiten werden angezeigt
    answer: 1
    explanation: "Der Router prüft die Routen der Reihe nach und nimmt die erste, die passt. Feste Pfade wie `tasks/new` gehören deshalb vor Parameter wie `tasks/:id`."
  - question: "Was macht `submit(this.taskForm, async () => { … })`, wenn der Titel leer ist?"
    options:
      - Es führt die Aktion trotzdem aus
      - Es wirft eine Exception
      - Es leert das Formular
      - Es markiert alle Felder als berührt, damit die Fehler erscheinen, und führt die Aktion nicht aus
    answer: 3
  - question: "Warum braucht der Titel `required` und `minLength`?"
    options:
      - Ein leerer Wert besteht `minLength` – erst `required` verbietet ihn
      - "`minLength` funktioniert nur zusammen mit `required`"
      - Doppelt hält besser, nötig ist es nicht
      - "`required` prüft nur Zahlen"
    answer: 0
  - question: "Warum gibt `add()` die neue Aufgabe zurück?"
    options:
      - Damit der Store sie speichern kann
      - Weil Methoden in Services immer etwas zurückgeben müssen
      - Damit das Formular ihre neue id kennt und zur Detailseite navigieren kann
      - Damit Angular das Formular zurücksetzt
    answer: 2
exercise:
  example: ex-project-form
  title: Das Formular fertig bauen
  task: |-
    Das Formular unter **New task** speichert noch nichts und prüft nichts.

    1. Gib `form()` ein Schema: Der Titel ist Pflicht und hat 3 bis 80 Zeichen, die Notizen höchstens 500. Gib jeder Regel eine `message`.
    2. Lege in der Aktion von `submit()` die Aufgabe mit `this.store.add(this.model())` an und navigiere zu ihrer Detailseite `/tasks/<id>`.
  checks:
    title-required: Ein leerer Titel zeigt einen `required`-Fehler und wird nicht gespeichert
    title-length: Zu kurze oder zu lange Titel und zu lange Notizen zeigen `minLength` bzw. `maxLength`
    saves-and-navigates: Eine gültige Aufgabe öffnet ihre Detailseite und steht danach in der Liste
---

# Aufgaben anlegen mit Signal Forms

Bisher gibt es nur die drei Aufgaben, die im Store stehen. Jetzt kommt ein Formular dazu, mit dem du neue anlegst – unter `/tasks/new`, mit Validierung und anschließendem Sprung zur neuen Aufgabe.

## Route und Store

Zuerst die Route. Sie muss **vor** `tasks/:id` stehen:

```ts
{ path: 'tasks', component: TaskList, title: 'Tasks' },
// Before tasks/:id – otherwise :id would match "new".
{ path: 'tasks/new', loadComponent: () => import('./task-form').then((m) => m.TaskForm), title: 'New task' },
{ path: 'tasks/:id', loadComponent: () => import('./task-detail').then((m) => m.TaskDetail), title: 'Task' },
```

Der Router prüft die Routen der Reihe nach. Stünde `tasks/:id` vorne, würde es auch `/tasks/new` abfangen – mit `id = 'new'`.

Das Formular bearbeitet keinen ganzen `Task`, denn id und Status gibt es noch nicht. Dafür gibt es einen eigenen Typ:

```ts
export type TaskDraft = Pick<Task, 'title' | 'notes'>;
```

Der Store bekommt eine Methode, die aus dem Entwurf eine Aufgabe macht und sie **zurückgibt**. Das Formular braucht die neue id, um dorthin zu navigieren:

```ts
add(draft: TaskDraft): Task {
  const id = Math.max(0, ...this.tasks().map((t) => t.id)) + 1;
  const task: Task = { id, ...draft, done: false };
  this.state.update((tasks) => [...tasks, task]);
  return task;
}
```

## Das Formular

Mit Signal Forms beschreibst du das Modell als Signal und die Regeln als Schema:

```ts
export class TaskForm {
  private readonly store = inject(TaskStore);
  private readonly router = inject(Router);

  protected readonly model = signal<TaskDraft>({ title: '', notes: '' });

  protected readonly taskForm = form(this.model, (path) => {
    required(path.title, { message: 'Please enter a title.' });
    minLength(path.title, 3, { message: 'At least 3 characters.' });
    maxLength(path.title, 80, { message: 'At most 80 characters.' });
    maxLength(path.notes, 500, { message: 'At most 500 characters.' });
  });

  protected save(event: Event): void {
    event.preventDefault();
    void submit(this.taskForm, async () => {
      const task = this.store.add(this.model());
      await this.router.navigate(['/tasks', task.id]);
      return undefined;
    });
  }
}
```

- `required` und `minLength` gehören zusammen: Ein leerer Wert besteht `minLength`, erst `required` verbietet ihn.
- `submit()` markiert alle Felder als berührt, sodass ihre Fehler erscheinen, und führt die Aktion nur bei einem gültigen Formular aus.
- Die Aktion gibt `undefined` zurück: keine Fehler vom „Server“. In der nächsten Lektion wird sie wirklich asynchron.

> [!NOTE]
> Signal Forms (`@angular/forms/signals`) sind in Angular 21 noch experimentell und ab Angular 22 stabil. Die API in diesem Kapitel ist in beiden Versionen gleich.

## Das Template

```html
<form (submit)="save($event)" novalidate>
  <p>
    <label for="title">Title</label>
    <input id="title" [formField]="taskForm.title" aria-describedby="title-errors" />
    <app-field-errors id="title-errors" [field]="taskForm.title" />
  </p>
  <!-- notes genauso, mit <textarea> -->
  <button type="submit">Save task</button>
</form>
```

Die Fehler zeigt eine kleine Komponente `FieldErrors` an, wie in der Lektion zur Validierung: erst, wenn das Feld berührt wurde, damit niemand schon beim Öffnen der Seite rote Meldungen sieht. `aria-describedby` verbindet die Meldungen mit dem Feld, sodass ein Screenreader sie zusammen mit dem Feld vorliest. `novalidate` schaltet die Prüfung des Browsers ab, damit nur die Meldungen von Angular erscheinen.

::tryit{project-forms}

Lege eine Aufgabe an: Die App springt zu ihrer Detailseite, und der Zähler im Kopf zählt eins hoch. Drück auch einmal mit leerem Titel auf **Save task**.

## Was noch fehlt

Lädst du die Vorschau neu, sind neue Aufgaben weg – sie leben nur im Speicher des Browsers. In der nächsten Lektion holt der Store die Aufgaben vom Server und schickt neue dorthin.

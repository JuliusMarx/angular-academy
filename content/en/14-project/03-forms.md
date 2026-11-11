---
title: Creating Tasks with Signal Forms
minutes: 9
summary: |-
  - A new route `tasks/new` for the form. It must come **before** `tasks/:id`, otherwise `:id` matches "new".
  - The form edits a `TaskDraft` (title and notes) – the store assigns the id and status.
  - `form(model, (path) => { … })` gets the rules as a schema: `required`, `minLength`, `maxLength`, each with a `message`.
  - `submit(form, action)` marks all fields as touched and only runs the action when the form is valid.
  - The action creates the task in the store (`add()` returns it with its new id) and navigates to the detail page with `router.navigate(['/tasks', task.id])`.
  - Show errors only after a field was touched and connect them to the field with `aria-describedby`. Every field needs a visible `<label>`.

  ```ts
  protected readonly taskForm = form(this.model, (path) => {
    required(path.title, { message: 'Please enter a title.' });
    minLength(path.title, 3, { message: 'At least 3 characters.' });
    maxLength(path.title, 80, { message: 'At most 80 characters.' });
  });
  ```
quiz:
  - question: "The routes are in the order `tasks/:id`, then `tasks/new`. What happens when you open `/tasks/new`?"
    options:
      - The form appears, the router always picks the most specific route
      - The router takes the first matching route, `tasks/:id` – the detail page looks for a task with the id "new"
      - Angular reports an error at startup
      - Both pages are shown
    answer: 1
    explanation: "The router checks the routes in order and takes the first one that matches. So fixed paths like `tasks/new` belong before parameters like `tasks/:id`."
  - question: "What does `submit(this.taskForm, async () => { … })` do when the title is empty?"
    options:
      - It runs the action anyway
      - It throws an exception
      - It clears the form
      - It marks all fields as touched so the errors appear, and doesn't run the action
    answer: 3
  - question: "Why does the title need both `required` and `minLength`?"
    options:
      - An empty value passes `minLength` – only `required` rejects it
      - "`minLength` only works together with `required`"
      - Better safe than sorry, it isn't necessary
      - "`required` only checks numbers"
    answer: 0
  - question: "Why does `add()` return the new task?"
    options:
      - So the store can save it
      - Because methods in services always have to return something
      - So the form knows its new id and can navigate to the detail page
      - So Angular resets the form
    answer: 2
exercise:
  example: ex-project-form
  title: Finishing the Form
  task: |-
    The form under **New task** doesn't save or check anything yet.

    1. Give `form()` a schema: the title is required and has 3 to 80 characters, the notes have at most 500. Give every rule a `message`.
    2. In the action of `submit()`, create the task with `this.store.add(this.model())` and navigate to its detail page `/tasks/<id>`.
  checks:
    title-required: An empty title shows a `required` error and isn't saved
    title-length: Titles that are too short or too long and notes that are too long show `minLength` or `maxLength`
    saves-and-navigates: A valid task opens its detail page and then shows up in the list
---

# Creating Tasks with Signal Forms

So far there are only the three tasks in the store. Now you add a form to create new ones – at `/tasks/new`, with validation and a jump to the new task afterwards.

## Route and store

First the route. It must come **before** `tasks/:id`:

```ts
{ path: 'tasks', component: TaskList, title: 'Tasks' },
// Before tasks/:id – otherwise :id would match "new".
{ path: 'tasks/new', loadComponent: () => import('./task-form').then((m) => m.TaskForm), title: 'New task' },
{ path: 'tasks/:id', loadComponent: () => import('./task-detail').then((m) => m.TaskDetail), title: 'Task' },
```

The router checks the routes in order. If `tasks/:id` came first, it would also catch `/tasks/new` – with `id = 'new'`.

The form doesn't edit a whole `Task`, because there is no id or status yet. It gets a type of its own:

```ts
export type TaskDraft = Pick<Task, 'title' | 'notes'>;
```

The store gets a method that turns the draft into a task and **returns** it. The form needs the new id to navigate there:

```ts
add(draft: TaskDraft): Task {
  const id = Math.max(0, ...this.tasks().map((t) => t.id)) + 1;
  const task: Task = { id, ...draft, done: false };
  this.state.update((tasks) => [...tasks, task]);
  return task;
}
```

## The form

With Signal Forms you describe the model as a signal and the rules as a schema:

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

- `required` and `minLength` go together: an empty value passes `minLength`, only `required` rejects it.
- `submit()` marks all fields as touched, so their errors appear, and only runs the action when the form is valid.
- The action returns `undefined`: no errors from the "server". In the next lesson it becomes truly asynchronous.

> [!NOTE]
> Signal Forms (`@angular/forms/signals`) are still experimental in Angular 21 and stable from Angular 22 on. The API used in this chapter is the same in both versions.

## The template

```html
<form (submit)="save($event)" novalidate>
  <p>
    <label for="title">Title</label>
    <input id="title" [formField]="taskForm.title" aria-describedby="title-errors" />
    <app-field-errors id="title-errors" [field]="taskForm.title" />
  </p>
  <!-- notes the same way, with a <textarea> -->
  <button type="submit">Save task</button>
</form>
```

A small component, `FieldErrors`, shows the errors, like in the lesson on validation: only after the field was touched, so nobody sees red messages as soon as the page opens. `aria-describedby` connects the messages to the field, so a screen reader reads them together with the field. `novalidate` turns off the browser's own validation, so only Angular's messages appear.

::tryit{project-forms}

Create a task: the app jumps to its detail page, and the counter in the header goes up by one. Also press **Save task** once with an empty title.

## What's still missing

If you reload the preview, new tasks are gone – they only live in the browser's memory. In the next lesson, the store fetches the tasks from the server and sends new ones there.

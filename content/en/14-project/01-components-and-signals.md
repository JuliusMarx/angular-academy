---
title: Project start – components and signals
minutes: 9
summary: |-
  - In this chapter you build a small task app in four steps: list, detail page, form, server. Each lesson builds on the state of the previous one.
  - First the data model: an `interface Task` with `id`, `title`, `notes` and `done`.
  - A **store service** (`providedIn: 'root'`) keeps the tasks in a private `signal()` and exposes them with `asReadonly()`. Changes only go through methods like `toggle()`.
  - Derived values like the number of open tasks are `computed()` – in the store if everyone needs them, in the component if only it does.
  - Small components get data via `input()` and report actions via `output()`. They don't change the store themselves.
  - Never change signals in place, replace them: `update((tasks) => tasks.map(…))` creates a new array.

  ```ts
  @Injectable({ providedIn: 'root' })
  export class TaskStore {
    private readonly state = signal<Task[]>([]);
    readonly tasks = this.state.asReadonly();
    readonly openCount = computed(() => this.tasks().filter((t) => !t.done).length);
  }
  ```
quiz:
  - question: "Why does the store expose `this.state.asReadonly()` instead of the signal `state` itself?"
    options:
      - Because writable signals don't work in templates
      - So components can read the tasks but only change them through the store's methods
      - Because `asReadonly()` is faster
      - So the data ends up in `localStorage`
    answer: 1
    explanation: That way there is exactly one place where tasks change. You find bugs faster, and rules (such as new ids) apply everywhere.
  - question: "`toggle()` sets `task.done = true` directly in the array and then calls `state.set(tasks)` with the same array. What happens?"
    options:
      - Everything updates correctly
      - Angular throws an error
      - The signal holds the same array as before, so it counts as unchanged – dependent `computed()` values and the view don't update reliably
      - The array is copied automatically
    answer: 2
    explanation: "By default, signals compare with `Object.is`. Create new objects: `tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t))`."
  - question: "Where does the list's current filter (All/Open/Done) belong?"
    options:
      - In a `signal()` in the list component, because only it needs it
      - In the store, because all data belongs in the store
      - In a global variable
      - In an `effect()`
    answer: 0
    explanation: State that only one component needs stays there. The store holds what several parts of the app share.
  - question: "`TaskItem` should report that its checkbox was clicked. How?"
    options:
      - It calls `inject(TaskStore).toggle()` itself
      - It sets `task().done` directly
      - It has an `output()`, and the parent component decides what happens
      - Through an `@Input()`
    answer: 2
exercise:
  example: ex-project-filter
  title: A filter for the list
  task: |-
    The list should be filterable: all tasks, only open ones or only finished ones.

    1. In `App`, create a signal `filter` (start value `'all'`) and a `computed()` `visible` with the store's tasks that match the filter.
    2. In the `<div role="group">`, create a `<button type="button">` with its `label` for every entry in `filters`. A click sets the filter, `aria-pressed` shows whether it is the current one.
    3. Let the list loop over `visible()` instead of all tasks.
  checks:
    filter-buttons: "There are buttons **All**, **Open** and **Done**, and at first only **All** is pressed (`aria-pressed`)"
    filter-lists: "**Open** shows only open tasks, **Done** only finished ones"
    filter-reacts: A task ticked off under **Open** disappears from the list right away
---

# Project start – components and signals

You now know all the important building blocks. In this chapter you put them together into **one** app: a small task list. It grows in four steps:

| Lesson | What's new |
|---|---|
| 1. Components and signals | Data model, store service, list, filter |
| 2. Routing | A detail page per task, navigation |
| 3. Forms | Creating tasks with Signal Forms and validation |
| 4. HTTP and tests | Data from the server, writing via POST/PUT, unit tests |

Every example starts with the state the previous one ended with – including the solution of the exercise. So you can jump in at any point.

## The data model

It starts with a question: what data does the app have? Four fields are enough for a task:

```ts
export interface Task {
  id: number;
  title: string;
  notes: string;
  done: boolean;
}
```

A dedicated `interface` pays off even in small apps. TypeScript then reports typos like `task.titel`, and every component talks about the same fields.

## The store

Several components will need the tasks: the list, the detail page, the form and the counter in the header. That's why they live in a **service**, not in a component. Because it "stores" the app's state, such a service is often called a **store**:

```ts
@Injectable({ providedIn: 'root' })
export class TaskStore {
  private readonly state = signal<Task[]>([ /* … */ ]);

  /** Read-only for components – changes go through the methods below. */
  readonly tasks = this.state.asReadonly();
  readonly openCount = computed(() => this.tasks().filter((t) => !t.done).length);

  toggle(id: number): void {
    this.state.update((tasks) => tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }
}
```

Three decisions are built into it:

- **Write privately, read publicly.** The writable signal is `private`. With `asReadonly()`, the outside gets a version without `set()` and `update()`. Changes only go through methods like `toggle()` – so there is exactly one place where tasks change.
- **Derived values are `computed()`.** The number of open tasks isn't stored but computed. That way it can never be out of date.
- **Replace, don't mutate.** `update()` returns a **new** array with a **new** object for the changed task. If you change `t.done` directly, the array stays the same and the signal doesn't notice anything.

> [!TIP]
> `providedIn: 'root'` makes the store a singleton: all components get the same instance via `inject(TaskStore)`. From Angular 22 on you can use the shorter `@Service()` decorator for that. The examples run on Angular 21 and therefore use `@Injectable`.

## Components

The list shows each task with a small component, `TaskItem`. It gets the task via `input()` and reports a click via `output()`:

```ts
@Component({
  selector: 'app-task-item',
  template: `
    <label>
      <input type="checkbox" [checked]="task().done" (change)="toggled.emit()" />
      <span [class.done]="task().done">{{ task().title }}</span>
    </label>
  `,
})
export class TaskItem {
  readonly task = input.required<Task>();
  readonly toggled = output();
}
```

`TaskItem` doesn't know the store. The parent component decides what happens on a click:

```html
@for (task of store.tasks(); track task.id) {
  <li><app-task-item [task]="task" (toggled)="store.toggle(task.id)" /></li>
} @empty {
  <li>No tasks yet.</li>
}
```

Such "dumb" components are easy to reuse and to test, because they only depend on their inputs. `track task.id` makes sure Angular doesn't rebuild the whole list when you tick a task off, but only updates that one row.

::tryit{project-components}

Tick off a task in the example: the counter "… of 3 open" updates, although `App` never recomputes it. `openCount` depends on `tasks`, and `tasks` has changed.

## Local state or store?

Not all state belongs in the store. A good rule of thumb:

| State | Where? |
|---|---|
| The tasks themselves | Store – list, detail and form need them |
| Number of open tasks | `computed()` in the store – the header shows it too |
| The list's selected filter | `signal()` in the list component – only it needs it |
| Whether a section is expanded | `signal()` in the component |

In the exercise you build exactly such a filter: a local signal plus a `computed()` that filters the store's tasks. Because the `computed()` depends on **both**, the list also updates when you tick off a task under "Open".

> [!NOTE]
> The filter buttons are toggles. `aria-pressed="true"` tells screen readers which one is active, and `role="group"` with an `aria-label` groups them under a name.

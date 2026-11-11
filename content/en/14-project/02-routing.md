---
title: List and Detail Page
minutes: 8
summary: |-
  - The app becomes a **shell**: `App` only contains the navigation, the counter and `<router-outlet />`. The list moves into its own page, `TaskList`.
  - Routes: `tasks` for the list, `tasks/:id` for the detail page, `''` and `**` redirect to `tasks`.
  - The detail page is loaded with `loadComponent` only when someone opens it.
  - With `withComponentInputBinding()`, `:id` arrives as an input: `id = input.required({ transform: numberAttribute })`.
  - The task is a `computed()` of store and id. It updates when either changes. If the id doesn't exist, the page says "not found".
  - Links: `[routerLink]="['/tasks', task().id]"`. `routerLinkActive` with `ariaCurrentWhenActive="page"` marks the active link for screen readers too.
  - No link inside a `<label>`: the checkbox then gets its name via `aria-label`.

  ```ts
  { path: 'tasks/:id', loadComponent: () => import('./task-detail').then((m) => m.TaskDetail) }

  readonly id = input.required({ transform: numberAttribute });
  protected readonly task = computed(() => this.store.tasks().find((t) => t.id === this.id()));
  ```
quiz:
  - question: "Why is `task` in `TaskDetail` a `computed()` and not a value looked up once in the constructor?"
    options:
      - Because inputs aren't set yet in the constructor, and the id and the store can change later
      - Because `find()` is only allowed in `computed()`
      - Because the router wouldn't deliver parameters otherwise
      - There is no difference
    answer: 0
    explanation: "A `computed()` reads `id()` and `store.tasks()`. If the URL changes from `/tasks/2` to `/tasks/3` or you tick the task off, it recomputes."
  - question: "What is `transform: numberAttribute` on the input `id` for?"
    options:
      - It checks whether the task exists
      - It turns the text from the URL into a number, so `t.id === this.id()` matches
      - It makes the input optional
      - It loads the component lazily
    answer: 1
  - question: "What does `loadComponent: () => import('./task-detail').then((m) => m.TaskDetail)` do?"
    options:
      - The component is recompiled on every visit
      - The detail page goes into its own bundle and is only loaded when someone opens a task
      - The component is rendered in the background in advance
      - The route is only for signed-in users
    answer: 1
  - question: "Why does the checkbox in `TaskItem` now have an `aria-label` instead of a surrounding `<label>`?"
    options:
      - Because `<label>` isn't allowed in Angular
      - Because `aria-label` looks better
      - Because the title is now a link – and other interactive elements shouldn't sit inside a `<label>`
      - Because checkboxes don't need a name
    answer: 2
---

# List and Detail Page

So far the app only shows a list. Now every task gets its own page at `/tasks/<id>`. For that, `App` becomes a **shell**, and the pages switch inside the `<router-outlet />`.

## The routes

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

- The **list** is the start page and is loaded right away.
- The **detail page** is loaded **lazily** with `loadComponent`: it goes into its own bundle, which the browser only fetches when someone opens a task.
- `title` sets the title of the browser tab. It shows up in the history and in bookmarks and tells screen reader users which page they are on. Every route should have one.
- `**` catches all unknown URLs. Here it redirects to the list; you could also show a 404 page of your own.

## The shell

`App` now only contains what is the same on every page:

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

`routerLinkActive` sets the class `active` on the link of the current page, and `ariaCurrentWhenActive="page"` also sets `aria-current="page"`. Sighted users recognize the active link by its styling, screen readers by the attribute. With `exact: true`, the link only counts as active on `/tasks` itself, not on `/tasks/2`.

The list from before – including the filter from the exercise – moves unchanged into the component `TaskList`. Because the tasks live in the store and not in `App`, nothing had to be rebuilt for that.

## The detail page

Thanks to `withComponentInputBinding()`, the placeholder `:id` arrives as an input. In the URL it is text; `numberAttribute` turns it into a number:

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

`task` is a `computed()` of **two** sources: the id from the URL and the tasks in the store. When you click "Mark as done", the store changes, and the detail page, the list and the counter in the header update together.

> [!TIP]
> Always expect that an id doesn't exist – anyone can type any URL. The `@else` branch then shows a clear message instead of an empty page.

## Links in the list

Every task links to its page:

```html
<input type="checkbox" [checked]="task().done" [attr.aria-label]="'Done: ' + task().title" (change)="toggled.emit()" />
<a [routerLink]="['/tasks', task().id]">{{ task().title }}</a>
```

Before, the title was inside the checkbox's `<label>`. But a link shouldn't sit inside a `<label>`: clicking the title then only opens the link and doesn't toggle the checkbox. The label no longer works as a click target, and the checkbox gets harder to use. That's why the checkbox now gets its name via `aria-label`, for example "Done: Plan the project".

::tryit{project-routing}

Open a task, change its status and go back to the list. Also try an id that doesn't exist by changing the URL in the preview.

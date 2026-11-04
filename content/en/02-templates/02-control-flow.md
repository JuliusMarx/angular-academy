---
title: Control flow with @if, @for and @switch
minutes: 8
summary: |-
  - Control flow blocks start with `@` and are built in. Nothing to import.
  - `@if` / `@else if` / `@else` shows content conditionally; `as` stores the result of the condition in a variable.
  - `@for` renders lists. `track` is required and should be a unique ID.
  - `@empty` appears when the list is empty; inside the loop you have `$index`, `$first`, `$last`, `$even` and `$odd`.
  - `@switch` with `@case` and `@default` handles multiple cases.

  ```html
  @for (todo of todos(); track todo.id) {
    <li>{{ $index + 1 }}. {{ todo.title }}</li>
  } @empty {
    <li>No tasks yet.</li>
  }
  ```

  > [!WARNING] Only use `track $index` when items have no unique ID. Otherwise sorting or deleting re-renders more than necessary.
quiz:
  - question: What is required in @for?
    options: ["An @empty block", "A track expression", "An index ($index)", "A sort order"]
    answer: 1
    explanation: "`track` tells Angular how to recognize items, so only the affected DOM elements are updated when the list changes."
  - question: Which block does @for show when the list is empty?
    options: ["@else", "@default", "@empty", "@none"]
    answer: 2
exercise:
  example: ex-control-flow
  title: A task list
  task: |-
    The list `<ul id="tasks">` is still empty. Fill it:

    1. Use `@for` to render one `<li>` with its title per task. Don't forget `track`.
    2. When the list is empty, show `<li class="empty">No tasks</li>` – using `@empty`.
  checks:
    renders-list: The three tasks appear as list items
    add-works: After **Add** there is a fourth task in the list
    empty-state: 'After **Clear**, **No tasks** appears'
---

# Control flow with @if, @for and @switch

**Control flow blocks** decide *what* the template shows. They start with `@` and are built right into Angular – nothing to import.

## @if – conditional content

```html
@if (user(); as u) {
  <p>Welcome back, {{ u.name }}!</p>
} @else if (loading()) {
  <p>Loading …</p>
} @else {
  <button (click)="login()">Sign in</button>
}
```

With `as` you store the result of the condition in a variable – handy when the value is an object.

## @for – rendering lists

```html
<ul>
  @for (todo of todos(); track todo.id) {
    <li>{{ $index + 1 }}. {{ todo.title }}</li>
  } @empty {
    <li>No tasks yet.</li>
  }
</ul>
```

- **`track`** is required. Use a unique ID so Angular can reuse items efficiently.
- **`@empty`** is shown when the list is empty.
- Inside the loop you can use variables such as `$index`, `$first`, `$last`, `$even` and `$odd`.

> [!WARNING]
> Only use `track $index` when items have no unique ID. Otherwise sorting or deleting re-renders more elements than necessary.

## @switch – multiple cases

```html
@switch (status()) {
  @case ('loading') { <p>Loading …</p> }
  @case ('error') { <p>Error!</p> }
  @default { <p>Done.</p> }
}
```

::tryit{control-flow}

> [!TIP]
> Empty the list in the example with the button – then replace the outer `@if` with an `@empty` block.

---
title: Lazy Loading with @defer
minutes: 8
summary: |-
  - `@defer` loads part of the template only when needed; Angular splits the components inside into a separate JavaScript file.
  - Without a trigger, Angular loads the content as soon as the browser is idle (`on idle`).
  - `@placeholder` shows until the trigger fires, `@loading` while loading, `@error` if it fails. `minimum` prevents flickering.
  - More triggers: `on viewport`, `on interaction`, `on hover`, `on timer(2s)`, `on immediate` and `when condition()`.
  - `prefetch` loads the code in advance but only shows the content later.

  ```html
  @defer (on viewport) {
    <app-comments />
  } @placeholder {
    <p>Comments</p>
  } @loading (minimum 500ms) {
    <p>Loading comments …</p>
  }
  ```

  > [!WARNING] A component is only split out if it is used exclusively inside `@defer` blocks in that file – not in a `viewChild()` query either.
quiz:
  - question: What happens to the code of a component that is only used inside a @defer block?
    options:
      - It is loaded immediately when the app starts
      - It is split into its own file and only loaded when triggered
      - It is not compiled at all
      - It runs on the server
    answer: 1
  - question: Which block is shown before loading even starts?
    options: ["@loading", "@placeholder", "@error", "@empty"]
    answer: 1
    explanation: "`@placeholder` is shown until the trigger fires. Then `@loading` shows the loading state."
  - question: Which trigger loads content as soon as it is scrolled into view?
    options: ["on idle", "on hover", "on viewport", "on timer"]
    answer: 2
---

# Lazy Loading with @defer

Not everything has to be loaded at startup. With `@defer` you tell Angular: *load this part of the template only when it's needed.* Angular automatically splits the affected components into a separate JavaScript file, so your app starts faster.

## The basic form

```html
@defer {
  <app-comments />
}
```

Without further options, Angular loads the content as soon as the browser is idle (`on idle`).

## Placeholder, loading state and errors

```html
@defer (on viewport) {
  <app-comments />
} @placeholder {
  <p>Comments</p>
} @loading (minimum 500ms) {
  <p>Loading comments …</p>
} @error {
  <p>Comments could not be loaded.</p>
}
```

| Block | When it is shown |
|---|---|
| `@placeholder` | before the trigger fires |
| `@loading` | while the code is loading |
| `@error` | if loading fails |

`minimum` prevents a state from flickering by too quickly.

## Triggers – when to load

| Trigger | Loads when … |
|---|---|
| `on idle` | the browser is idle (default) |
| `on viewport` | the placeholder scrolls into view |
| `on interaction` | the placeholder is clicked or receives input |
| `on hover` | the mouse moves over the placeholder |
| `on timer(2s)` | the given time has passed |
| `on immediate` | right after the first render |
| `when condition()` | the expression becomes `true` |

With `prefetch` you load the code in advance but only show the content later:

```html
@defer (on interaction; prefetch on idle) {
  <app-editor />
} @placeholder {
  <button>Open editor</button>
}
```

::tryit{defer-blocks}

> [!WARNING]
> For a component to actually be split out, it must be used **only** inside `@defer` blocks in that file – not in a `viewChild()` query either.

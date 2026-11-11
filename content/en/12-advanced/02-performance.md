---
title: Performance
minutes: 9
summary: |-
  - A method in the template runs on every update. `computed()` remembers its result and only recomputes when its signals change.
  - In `@for`, use a stable ID like `track item.id`. `track $index` only suits lists that are never reordered.
  - Lazy routes load whole pages on first visit, `@defer` does the same for parts of a page.
  - `NgOptimizedImage` (`ngSrc`) loads images lazily, prevents layout jumps via `width`/`height`, and `priority` loads the most important image first.
  - Measure before optimizing: Angular DevTools (profiler), bundle sizes and budgets from `ng build`, Lighthouse.

  ```html
  @defer (on viewport) {
    <app-reviews />
  } @placeholder {
    <p>Reviews</p>
  }
  ```
quiz:
  - question: "Why is `computed()` better in a template than a method call like `visible()`?"
    options:
      - Methods are forbidden in templates
      - "`computed()` remembers its result and only recalculates when its signals change"
      - "`computed()` runs on the server"
      - There is no difference
    answer: 1
  - question: "What does `track p.id` do in a `@for` loop?"
    options:
      - It sorts the list by ID
      - Angular recognizes each element and only recreates DOM elements that changed
      - It filters out duplicates
      - It loads the list bit by bit
    answer: 1
  - question: "What does `@defer (on viewport)` do?"
    options:
      - The content is hidden
      - The block's code and content are only loaded once the placeholder becomes visible
      - The block only renders on the server
      - The block reloads every few seconds
    answer: 1
exercise:
  example: ex-performance
  title: A Fast Product List
  task: |-
    The list works, but it does too much work:

    1. Turn the method `visible()` into a `computed()`, so it doesn't filter again on every click on ❤.
    2. Track the products in `@for` by their `id` instead of their position (`$index`).
  checks:
    filter-works: The filter still shows the matching products
    no-needless-filtering: "Clicks on ❤ don't run the filter again"
    track-by-id: A new product at the top keeps the existing elements with their products
---

# Performance

Angular apps are fast out of the box. They usually get slow because of a few typical patterns: work that is repeated on every update, DOM elements that are recreated for no reason, and code that is loaded before anyone needs it.

## Calculating only when needed: computed

A method in the template runs on **every** update of the component, whether its data changed or not:

```html
@for (p of visible(); track p.id) { … }  <!-- visible() as a method: runs on every click -->
```

A `computed()` remembers its result and only recalculates when one of the signals it reads changes:

```ts
protected readonly visible = computed(() => filterProducts(this.products(), this.query()));
```

::tryit{perf-list}

Click ❤ in the example: the counter "The filter ran … times" stays the same. With a method it would go up on every click, even twice in development mode, because Angular checks a second time there to catch mistakes.

## Lists: track

`track` tells Angular how to recognize an element of the list. With a stable ID like `track p.id`, only the affected DOM elements are created or removed when the list changes. The others stay, including focus, input and running animations.

With `track $index`, Angular only recognizes elements by their **position**. If you insert something at the top, every element gets its neighbor's content: Angular updates the whole DOM unnecessarily, and focus or input suddenly sticks to the wrong entry.

> [!TIP]
> Use `track item.id` (or another unique key). `$index` only fits lists that never reorder, such as fixed menu items.

## Loading later: @defer and lazy routes

Code that isn't needed right away doesn't have to be loaded right away:

- **Lazy routes** (*Routing* chapter) load whole pages on their first visit.
- **`@defer`** (*Templates* chapter) does the same for parts of a page:

```html
@defer (on viewport) {
  <app-reviews />
} @placeholder {
  <p>Reviews</p>
}
```

Angular puts `app-reviews` into a separate file. It is only loaded once the placeholder scrolls into view. Other triggers are `on interaction`, `on idle`, `on timer(2s)` and `when condition`.

## Images: NgOptimizedImage

Images are often the largest part of a page. The `NgOptimizedImage` directive helps automatically:

```html
<img ngSrc="/hero.jpg" width="1200" height="600" priority />
```

- It loads images below the visible area only when needed (lazy).
- Thanks to `width` and `height`, the page doesn't jump while loading.
- `priority` loads the most important image of the page first.

## Measure, don't guess

Before you optimize, measure:

- The **Angular DevTools** (browser extension) show in the *Profiler* which components are checked how often and for how long.
- `ng build` reports the size of the bundles. In `angular.json` you set budgets that warn about files that are too large.
- **Lighthouse** in the Chrome DevTools rates loading time and interactivity of the finished page.

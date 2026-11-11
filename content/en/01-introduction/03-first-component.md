---
title: Your First Component
minutes: 7
summary: |-
  - A component consists of a TypeScript class, a template and optional styles.
  - The `@Component` decorator turns a class into a component.
  - `selector` is the HTML tag (`<app-greeting />`), `template` or `templateUrl` the HTML, `styles` the CSS.
  - Styles are encapsulated automatically and apply to this component only.
  - To use a component in another one, add it to that component's `imports` array. This builds a component tree.

  ```ts
  @Component({
    selector: 'app-root',
    imports: [Greeting],
    template: `<app-greeting />`,
  })
  export class App {}
  ```

  > [!WARNING] If the `imports` entry is missing, Angular reports *"'app-greeting' is not a known element"*.
quiz:
  - question: How does Angular know where a component is used in HTML?
    options: [By its class name, By its selector, By its file name, By its templateUrl]
    answer: 1
    explanation: The `selector` (e.g. `app-greeting`) is the HTML tag the component is used with.
  - question: What do you need to do to use a component in another component's template?
    options:
      - Nothing, components are available globally
      - Register it in main.ts
      - Add it to the other component's imports array
      - Include it in index.html
    answer: 2
    explanation: Components are standalone. You import them via the `imports` array wherever you need them.
exercise:
  example: ex-first-component
  title: A Team Badge
  task: |-
    Build your first own component:

    1. In `user-badge.ts`, turn the class `UserBadge` into a component with the selector `app-user-badge`. Its template: `<span class="badge">Angular Fan</span>`.
    2. Import `UserBadge` in `app.ts`.
    3. Show the badge under both names.
  checks:
    component-exists: There is an `<app-user-badge>` on the page
    used-twice: The badge is used exactly twice
    shows-text: Each badge shows **Angular Fan** in a `<span class="badge">`
---

# Your First Component

An Angular app is made of **components**. Each component is a building block of the UI – a header, a list or a button, for example – and consists of three parts:

1. a **TypeScript class** holding data and logic,
2. a **template** (HTML) that defines what is displayed,
3. optional **styles** (CSS) that apply to this component only.

## The @Component decorator

A component is a regular class with the `@Component` decorator:

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-greeting',
  template: `<p>Hello from the greeting component!</p>`,
  styles: `p { color: crimson; }`,
})
export class Greeting {}
```

- **`selector`** – the HTML tag the component is used with: `<app-greeting />`
- **`template`** – the component's HTML. For larger templates, point to a separate `.html` file with `templateUrl` instead.
- **`styles`** – CSS that applies *only* to this component. Angular encapsulates styles automatically so they don't affect other components.

## Using components

To use a component in another component's template, import it via the `imports` array:

```ts
import { Component } from '@angular/core';
import { Greeting } from './greeting';

@Component({
  selector: 'app-root',
  imports: [Greeting],
  template: `
    <h1>My first Angular app</h1>
    <app-greeting />
  `,
})
export class App {}
```

This creates a **component tree**: `App` is the root and contains other components, which can contain further components.

::tryit{first-component}

> [!TIP]
> In the example, use `<app-greeting />` twice, or change the color in the greeting component's `styles` block.

> [!WARNING]
> If you forget the `imports` entry, Angular reports the error *"'app-greeting' is not a known element"*.

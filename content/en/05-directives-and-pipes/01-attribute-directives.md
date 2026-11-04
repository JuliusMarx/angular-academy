---
title: Custom attribute directives
minutes: 8
summary: |-
  - A directive has no template of its own – it attaches to an existing element and changes its appearance or behavior.
  - `selector: '[appHighlight]'` matches every element with the attribute `appHighlight`. You import it via `imports`, just like a component.
  - In the `host` object you bind properties (`'[style.backgroundColor]'`) and events (`'(mouseenter)'`) of the host element – instead of `@HostBinding`/`@HostListener`.
  - If a binding returns `null`, Angular removes the style again.
  - An input whose `alias` equals the selector takes the attribute value directly: `<p appHighlight="lightblue">`.
  - Think of keyboard users: also listen to `focusin` and `focusout`.

  ```ts
  @Directive({
    selector: '[appHighlight]',
    host: {
      '(mouseenter)': 'active.set(true)',
      '(mouseleave)': 'active.set(false)',
      '[style.backgroundColor]': "active() ? 'yellow' : null",
    },
  })
  export class Highlight {
    protected readonly active = signal(false);
  }
  ```
quiz:
  - question: How does a directive differ from a component?
    options:
      - Directives have their own template, components don't
      - Directives have no template – they extend an existing element
      - Directives only work with forms
      - There is no difference
    answer: 1
  - question: How does a directive react to an event on its host element?
    options:
      - With addEventListener in the constructor
      - With an entry like '(mouseenter)' in the host object
      - With (mouseenter) in the directive's template
      - Not at all, only components can do that
    answer: 1
  - question: "How do you make `<p appHighlight=\"lightblue\">` set the color?"
    options:
      - With an input whose alias equals the selector
      - With an output named appHighlight
      - With inject(ElementRef)
      - You can't – directives don't receive values
    answer: 0
exercise:
  example: ex-directive
  title: Mark external links
  task: |-
    External links should open in a new tab and be recognizable as external.

    1. Turn `ExternalLink` into a directive with the selector `a[appExternalLink]`.
    2. Use the `host` object to set `target="_blank"`, `rel="noopener noreferrer"` and the class `external`.
    3. Use it on the two external links in `app.ts` – leave the internal link as it is.
  checks:
    sets-target: Both external links have `target="_blank"`
    sets-rel: Both have `rel="noopener noreferrer"`
    adds-class: Both have the class `external`
    internal-untouched: The internal link stays unchanged
---

# Custom attribute directives

A **component** brings its own template. A **directive** has none – it attaches to an existing element and changes how it looks or behaves. You already know directives from Angular, such as `routerLink`. Now you'll write your own.

## The simplest directive

```ts
import { Directive } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  host: {
    '[style.backgroundColor]': "'yellow'",
  },
})
export class Highlight {}
```

- The `selector` in square brackets means: "every element with the attribute `appHighlight`".
- In the `host` object you bind properties of the **host element** – the element the directive sits on.

Just like components, you import directives where you need them:

```ts
@Component({
  imports: [Highlight],
  template: `<p appHighlight>I am yellow.</p>`,
})
export class App {}
```

> [!TIP]
> Give your own directives a prefix such as `app`. That way they don't clash with HTML attributes or directives from libraries.

## Reacting to events

In the `host` object you can also listen to events of the host element – with parentheses, just like in a template:

```ts
@Directive({
  selector: '[appHighlight]',
  host: {
    '(mouseenter)': 'active.set(true)',
    '(mouseleave)': 'active.set(false)',
    '[style.backgroundColor]': "active() ? 'yellow' : null",
  },
})
export class Highlight {
  protected readonly active = signal(false);
}
```

If a binding returns `null`, Angular removes the style again.

> [!NOTE]
> Older tutorials use `@HostBinding` and `@HostListener` for this. The `host` object is the recommended way: everything is in one place, and it works with signals.

## Passing values

Directives receive inputs just like components. If the input has the same name as the selector, the attribute value sets the color directly:

```ts
readonly color = input('', { alias: 'appHighlight' });
```

```html
<p appHighlight>Default color</p>
<p appHighlight="lightblue">Fixed color</p>
<p [appHighlight]="color()">Color from a signal</p>
```

::tryit{attribute-directive}

## Don't forget accessibility

If a directive only reacts to the mouse, keyboard users miss out. That's why the directive in the example also listens to `focusin` and `focusout` – a button is highlighted when you reach it with Tab, too.

> [!WARNING]
> With `inject(ElementRef)` you get the DOM element and could change it directly. Only do that when `host` bindings can't do the job – direct DOM access bypasses Angular and often doesn't behave as expected during server rendering.

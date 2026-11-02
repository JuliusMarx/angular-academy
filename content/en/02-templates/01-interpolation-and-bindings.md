---
title: Interpolation & bindings
minutes: 8
quiz:
  - question: How do you display the value of the signal title in a template?
    options: ["{{ title }}", "{{ title() }}", "[title]", "(title)"]
    answer: 1
    explanation: Signals are functions – you read their value by calling them.
  - question: Which syntax binds an event such as a click?
    options: ['[click]="save()"', "{{ click }}", '(click)="save()"', 'on-click="save"']
    answer: 2
    explanation: Parentheses mean event binding – data flows from the template into the class.
  - question: What does [disabled]="isEmpty()" do?
    options:
      - It sets the disabled attribute once on startup
      - It binds the DOM property disabled to the expression and keeps it updated
      - It calls isEmpty() on click
      - Nothing, this is not valid syntax
    answer: 1
---

# Interpolation & bindings

Templates connect your data to the HTML. Angular has three basic syntaxes for this:

| Syntax | Name | Direction |
|---|---|---|
| `{{ value }}` | Interpolation | class → template (text) |
| `[property]="value"` | Property binding | class → template (DOM property) |
| `(event)="handler()"` | Event binding | template → class |

## Interpolation

Double curly braces output a value as text:

```ts
@Component({
  selector: 'app-root',
  template: `
    <h1>Hello, {{ name() }}!</h1>
    <p>Your name has {{ name().length }} characters.</p>
  `,
})
export class App {
  protected readonly name = signal('Angular');
}
```

Inside `{{ }}` you write a **template expression** – similar to JavaScript, but deliberately limited. Complex logic belongs in the class.

> [!NOTE]
> `name` is a **signal** here. You read its value by calling it like a function: `name()`. More on this in the *Signals* chapter.

## Property binding

Square brackets bind a DOM property to an expression. When the value changes, Angular updates the element automatically:

```html
<input [value]="name()" />
<button [disabled]="name() === ''">Clear</button>
<img [src]="logoUrl" [alt]="logoText" />
```

CSS classes and styles have their own forms:

```html
<p [class.active]="isActive()">…</p>
<p [style.color]="color()">…</p>
```

## Event binding

Parentheses react to events. `$event` gives you the DOM event:

```ts
@Component({
  selector: 'app-root',
  template: `
    <input [value]="name()" (input)="onInput($event)" />
    <button (click)="name.set('')">Clear</button>
  `,
})
export class App {
  protected readonly name = signal('Angular');

  protected onInput(event: Event): void {
    this.name.set((event.target as HTMLInputElement).value);
  }
}
```

::tryit{template-bindings}

> [!TIP]
> Together, property and event binding give you data flow in both directions: the value flows into the input via `[value]`, changes come back via `(input)`.

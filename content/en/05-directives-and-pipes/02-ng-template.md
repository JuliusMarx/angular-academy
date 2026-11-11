---
title: Reusing Templates with ng-template
minutes: 9
summary: |-
  - An `<ng-template>` isn't displayed right away – it's a blueprint that you render once, several times or not at all.
  - `NgTemplateOutlet` from `@angular/common` renders a template, e.g. on an `<ng-container>`, which creates no DOM element itself.
  - You pass values as a context: `let-text` gets `$implicit`, `let-color="color"` gets the key `color`.
  - A component gets a template written between its tags with `contentChild(TemplateRef)`.
  - Start with `<ng-content>`. `<ng-template>` pays off when you need content several times, conditionally or with data from the component.

  ```html
  <ng-template #badge let-text let-color="color">
    <span [style.background]="color">{{ text }}</span>
  </ng-template>

  <ng-container *ngTemplateOutlet="badge; context: { $implicit: 'new', color: 'pink' }" />
  ```
quiz:
  - question: What happens to the content of an <ng-template> if you do nothing else?
    options:
      - It is displayed normally
      - It isn't displayed until something renders it
      - It is displayed as a comment
      - It is displayed after one second
    answer: 1
  - question: Which context key does let-item without a value pick up?
    options: [item, $implicit, $default, value]
    answer: 1
  - question: How does a component get an ng-template written between its tags?
    options: ["viewChild(TemplateRef)", "contentChild(TemplateRef)", "input<TemplateRef>()", "inject(TemplateRef)"]
    answer: 1
    explanation: Content between the tags is projected content – that's what `contentChild()` is for.
---

# Reusing Templates with ng-template

An `<ng-template>` is a piece of template that is **not displayed right away**. It's a blueprint you can render later – once, several times or not at all. That solves things `<ng-content>` can't.

## Rendering a template

```html
<ng-template #badge>
  <span class="badge">new</span>
</ng-template>

<ng-container *ngTemplateOutlet="badge" />
<ng-container *ngTemplateOutlet="badge" />
```

- `#badge` gives the template a name.
- `NgTemplateOutlet` renders it where you want – twice here.
- `<ng-container>` creates no element in the DOM itself. It's just a holder for the directive.

Import `NgTemplateOutlet` from `@angular/common` to use it.

## Passing values: the context

Templates can receive variables. You pass them as a **context** object and pick them up with `let-`:

```html
<ng-template #badge let-text let-color="color">
  <span [style.background]="color">{{ text }}</span>
</ng-template>

<ng-container *ngTemplateOutlet="badge; context: { $implicit: 'new', color: 'pink' }" />
```

- `let-text` without a value gets `$implicit` – the context's "default value".
- `let-color="color"` gets the key `color`.

## Passing templates to components

This gets really powerful when a component leaves part of its appearance to the parent. A list takes care of the frame, the parent decides what a row looks like:

```html
<app-item-list [items]="tasks()">
  <ng-template let-task let-i="index">
    {{ i + 1 }}. {{ task.title }}
  </ng-template>
</app-item-list>
```

The list picks up the template with `contentChild()` and renders it for each entry:

```ts
@Component({
  selector: 'app-item-list',
  imports: [NgTemplateOutlet],
  template: `
    @for (item of items(); track $index; let i = $index) {
      <ng-container *ngTemplateOutlet="rowTemplate() ?? defaultRow; context: { $implicit: item, index: i }" />
    }
    <ng-template #defaultRow let-item>{{ item }}</ng-template>
  `,
})
export class ItemList<T> {
  readonly items = input.required<T[]>();
  protected readonly rowTemplate = contentChild(TemplateRef);
}
```

If the parent doesn't pass a template, `defaultRow` is used.

::tryit{template-outlet}

## ng-content or ng-template?

| Aspect | `<ng-content>` | `<ng-template>` |
|---|---|---|
| Content is rendered | exactly once | as often as you like – or not at all |
| Conditional display (`@if`) | not reliable | yes |
| Receive data back from the component | no | yes, via the context |
| Effort | low | a bit more |

> [!TIP]
> Start with `<ng-content>`. Only when you need the same content several times or with data from the component is `<ng-template>` worth it.

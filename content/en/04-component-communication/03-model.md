---
title: Two-way binding with model()
minutes: 7
quiz:
  - question: How does model() differ from input()?
    options:
      - model() is faster
      - The child can change a model() itself, and the change reaches the parent
      - model() only works with forms
      - There is no difference
    answer: 1
  - question: How do you bind a signal quantity two-way to the model value?
    options: ['[value]="quantity()"', '(value)="quantity"', '[(value)]="quantity"', '[(value)]="quantity()"']
    answer: 2
    explanation: With `[( )]` you pass the signal itself, without parentheses – Angular reads and writes it.
  - question: Which event does model() create automatically for a property named checked?
    options: [checked, changeChecked, checkedChange, onChecked]
    answer: 2
---

# Two-way binding with model()

Some components don't just display a value, they let the user change it: a quantity picker, a switch, a slider. The parent provides the initial value – and wants to know when the user changes it.

`input()` plus `output()` would work, but `model()` does both in one.

## Declaring a model

```ts
import { Component, model } from '@angular/core';

@Component({
  selector: 'app-toggle-switch',
  template: `
    <button role="switch" [attr.aria-checked]="checked()" (click)="checked.set(!checked())">
      …
    </button>
  `,
})
export class ToggleSwitch {
  readonly checked = model(false);
}
```

`model()` is a **writable signal**: the component reads it with `checked()` and changes it with `set()` or `update()`.

## The "banana in a box"

In the parent you bind a model with `[( )]`:

```ts
protected readonly giftWrap = signal(false);
```

```html
<app-toggle-switch [(checked)]="giftWrap" />
<p>Gift wrap: {{ giftWrap() ? 'yes' : 'no' }}</p>
```

Now changes flow in **both directions**:

- If the parent calls `giftWrap.set(true)`, the switch turns on.
- If the user clicks the switch, `giftWrap` changes in the parent.

> [!NOTE]
> With `[(checked)]` you pass the **signal itself** – `giftWrap`, not `giftWrap()`. Angular needs the signal to be able to write into it.

## What's behind it

`[(checked)]="giftWrap"` is shorthand for two bindings:

```html
<app-toggle-switch [checked]="giftWrap()" (checkedChange)="giftWrap.set($event)" />
```

`model()` creates the output `checkedChange` automatically – always *name* + `Change`. If you only want to listen, you can bind `(checkedChange)` on its own.

## Required models and limits

Just like inputs, there is `model.required<T>()`. Always enforce limits in the component's logic – a disabled button alone isn't enough:

```ts
readonly value = model(1);
readonly max = input(99);

change(delta: number): void {
  this.value.update((v) => Math.min(this.max(), Math.max(1, v + delta)));
}
```

::tryit{component-model}

> [!WARNING]
> `[disabled]` doesn't stop clicks that arrive faster than Angular updates the view. In the example, the quantity would have gone past the maximum without the check in `change()`.

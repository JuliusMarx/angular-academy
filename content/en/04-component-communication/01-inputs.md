---
title: Passing data with input()
minutes: 8
quiz:
  - question: What happens if an input declared with input.required() is missing in the template?
    options:
      - The value is simply undefined
      - Angular throws an error at runtime
      - The template doesn't compile
      - Angular sets an empty string
    answer: 2
    explanation: The compiler reports `NG8008` – so the mistake shows up at build time, not in front of your users.
  - question: How does the child component read the value of an input named price?
    options: ["this.price", "this.price()", "this.price.value", "this.price.get()"]
    answer: 1
    explanation: An input is a read-only signal – you read it by calling it.
  - question: What does `name="Notebook"` without square brackets do?
    options:
      - It binds the expression Notebook
      - It passes the fixed string "Notebook"
      - It is a syntax error
      - It sets an HTML attribute, but not the input
    answer: 1
exercise:
  example: ex-inputs
  title: A price tag
  task: |-
    The `PriceTag` component still shows `? ?`.

    1. Give it a required input `amount` (number) and an input `currency` with the default `EUR`.
    2. Show the amount with two decimals and the currency, e.g. `12.50 EUR`.
    3. In `app.ts`, pass the amount `12.5` to the first tag, and `4.9` with the currency `USD` to the second.
  checks:
    shows-amount: The first tag shows the amount with two decimals
    default-currency: 'Without a currency it is **EUR**: `12.50 EUR`'
    custom-currency: The second tag shows `4.90 USD`
---

# Passing data with input()

Components become really useful once you can feed them data. A product card should show a mug one time and a backpack the next. For this, the child component declares **inputs** – properties that the parent component sets in its template.

## Declaring an input

```ts
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-product-card',
  template: `<h2>{{ name() }}</h2>`,
})
export class ProductCard {
  readonly name = input<string>(); // Signal<string | undefined>
}
```

`input()` creates a **read-only signal**. The child component reads it with `name()` but never changes it itself – the value belongs to the parent.

## Passing values

```html
<!-- With square brackets: an expression -->
<app-product-card [name]="product().title" [price]="12.5" />

<!-- Without brackets: a fixed string -->
<app-product-card name="Notebook" />
```

When the expression changes in the parent, Angular updates the input signal automatically – and with it everything that depends on it, such as a `computed()`.

## Default values and required inputs

```ts
readonly price = input(0);               // Signal<number>, default 0
readonly name = input.required<string>(); // Signal<string>, must be set
```

If a required input is missing, the template doesn't compile:

```bash
NG8008: Required input 'name' from component ProductCard must be specified.
```

> [!TIP]
> Use `input.required()` for everything the component can't work without. That way you don't need `undefined` checks in the template.

## Converting values with transform

HTML attributes are always strings. `transform` converts them as they come in. Angular ships two ready-made functions:

```ts
import { booleanAttribute, input, numberAttribute } from '@angular/core';

readonly price = input(0, { transform: numberAttribute });
readonly soldOut = input(false, { transform: booleanAttribute });
```

```html
<app-product-card name="Notebook" price="4.9" soldOut />
```

Now `price()` is the number `4.9`, and the bare attribute `soldOut` becomes `true` – just like `<button disabled>`.

## A different public name

With `alias`, the input has a different name in the template than in the class:

```ts
readonly label = input('', { alias: 'buttonLabel' });
```

```html
<app-button buttonLabel="Save" />
```

::tryit{component-inputs}

> [!NOTE]
> With inputs, data only flows **downwards**. How the child tells the parent something is the topic of the next lesson.

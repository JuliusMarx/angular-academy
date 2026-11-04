---
title: Dependent state with linkedSignal()
minutes: 7
summary: |-
  - `linkedSignal()` is a writable signal that resets when its source changes.
  - Unlike `computed()`, you can change it with `set()` and `update()`; no need for `signal()` plus `effect()`.
  - Short form: `linkedSignal(() => options()[0])` jumps to the first entry when `options` changes.
  - Long form with `source` and `computation`: the function receives the new source value and `previous`.
  - `previous.source` is the old source, `previous.value` the old value (even after `set()`). On the first call, `previous` is `undefined`.

  ```ts
  protected readonly size = linkedSignal<string, string>({
    source: this.product,
    computation: (product, previous) => {
      const sizes = SIZES[product];
      return previous && sizes.includes(previous.value) ? previous.value : sizes[0];
    },
  });
  ```
quiz:
  - question: How does linkedSignal() differ from computed()?
    options:
      - linkedSignal() is faster
      - linkedSignal() can also be changed with set() and update()
      - linkedSignal() only works with arrays
      - There is no difference
    answer: 1
  - question: What happens to a linkedSignal when its source changes?
    options:
      - Nothing, it keeps its value
      - It is destroyed
      - It is recalculated with the computation function
      - It throws an error
    answer: 2
exercise:
  example: ex-linked-signal
  title: Reset the selection
  task: |-
    The starter project has a bug: when you switch the category, an item from the old category stays selected.

    Replace `selected` with a `linkedSignal()` that jumps to the first item of the new category when the category changes – and can still be changed by clicking.
  checks:
    can-select: Clicking **Banana** selects Banana
    resets-on-category: 'After switching to **Vegetables**, **Carrot** is selected'
    select-after-reset: Afterwards you can still select by clicking
---

# Dependent state with linkedSignal()

Picture a product picker: the user chooses a product and then a size. When they switch products, the size should jump back to a valid value – but they still need to be able to change the size themselves.

- `computed()` doesn't fit, because it is read-only.
- `signal()` plus `effect()` works, but is clumsy and error-prone.

`linkedSignal()` is made for exactly this case: a **writable signal that resets when its source changes**.

## The short form

```ts
import { linkedSignal, signal } from '@angular/core';

const options = signal(['Red', 'Green', 'Blue']);
const selected = linkedSignal(() => options()[0]);

console.log(selected()); // 'Red'
selected.set('Blue');     // the user picks something
console.log(selected()); // 'Blue'

options.set(['Yellow', 'Purple']);
console.log(selected()); // 'Yellow' – reset because options changed
```

## The long form with previous

Often you want to keep the previous selection if it's still valid. For that, specify `source` and `computation`. The function receives the new source value and the previous state:

```ts
protected readonly product = signal('T-Shirt');

protected readonly size = linkedSignal<string, string>({
  source: this.product,
  computation: (product, previous) => {
    const sizes = SIZES[product];
    // Keep the previous size if the new product offers it too
    return previous && sizes.includes(previous.value) ? previous.value : sizes[0];
  },
});
```

`previous` contains `previous.source` (the old source) and `previous.value` (the old value, even if it was set via `set()`). On the first call, `previous` is `undefined`.

::tryit{linked-signal}

> [!TIP]
> In the example, pick size "L" for the T-shirt and switch to the hoodie: the size is kept. The shoes don't come in "L", so the selection jumps to the first size.

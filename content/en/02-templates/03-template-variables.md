---
title: "Template variables with @let and #ref"
minutes: 7
quiz:
  - question: How do you declare a local variable in a template?
    options: ["let total = price();", "@let total = price();", "#total = price()", "{{ let total = price() }}"]
    answer: 1
    explanation: "`@let` declares a read-only variable that updates automatically."
  - question: "What does the variable #nameInput in <input #nameInput /> refer to?"
    options:
      - The input's current value as a string
      - The input's DOM element
      - A signal holding the value
      - The component that contains the template
    answer: 1
  - question: Can you assign a new value to a @let variable in the template?
    options: ["Yes, with =", "Yes, with .set()", "No, @let variables are read-only", "Only inside @for"]
    answer: 2
---

# Template variables with @let and #ref

Sometimes you need a value several times in a template, or you want to access an element directly. Angular has two kinds of template variables for this.

## @let – storing values in the template

`@let` stores the result of an expression in a variable:

```html
@let total = totalPrice();
@let shipping = total >= 50 ? 0 : 4.9;

<p>Subtotal: {{ total }} €</p>
<p>Shipping: {{ shipping }} €</p>
<p>Total: {{ total + shipping }} €</p>
```

- The variable is available from its declaration onward, in the current template block and all nested blocks.
- When the values in the expression change, Angular updates the variable automatically.
- `@let` variables are **read-only** – you can't assign a new value to them.

`@let` is especially handy for shortening long expressions:

```html
@let user = session().currentUser;
<h2>{{ user.firstName }} {{ user.lastName }}</h2>
<p>{{ user.email }}</p>
```

> [!TIP]
> Use `@let` for values only the template needs. A value the class needs too belongs in the class as a `computed()`.

## #ref – template reference variables

`#name` gives an element in the template a name. You can then access the element elsewhere in the template:

```html
<input #productInput placeholder="Product name" />
<button (click)="add(productInput.value)">Add</button>
```

Here `productInput` refers to the `<input>` element. `productInput.value` reads the text – no event binding or extra signal needed.

On a component, `#ref` refers to the **component instance** instead of the DOM element:

```html
<app-timer #timer />
<button (click)="timer.reset()">Reset</button>
```

::tryit{template-variables}

> [!WARNING]
> Template references only work inside the template. In the class you access elements with `viewChild()` – you'll learn about it in the chapter on component communication.

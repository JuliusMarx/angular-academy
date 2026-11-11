---
title: Signal Forms
minutes: 8
summary: |-
  - Signal Forms (`@angular/forms/signals`) exist since Angular 21 and are stable since Angular 22.
  - The model is a plain signal. `form(this.model)` turns it into a typed field tree with the same fields.
  - `[formField]="signupForm.name"` (the `FormField` directive) binds an input element in both directions: input goes into the model, `model.set(...)` updates the fields.
  - Calling a field returns its state as signals: `value()`, `touched()`, `dirty()`, `valid()`/`invalid()`, `errors()`.
  - `submit()` runs your action only if the form is valid and first marks all fields as `touched`.
  - The data is always in the model: `this.model()` is the current state.

  ```ts
  protected readonly model = signal<Signup>({ name: '', email: '', weekly: false });
  protected readonly signupForm = form(this.model);
  ```

  ```html
  <input [formField]="signupForm.name" />
  ```
quiz:
  - question: Where does `form()` get its values from?
    options:
      - From the `value` attributes in the template
      - From the signal you pass in
      - From a FormGroup
      - From localStorage
    answer: 1
    explanation: "The signal is the single source of truth. The form reads from it and writes input straight back into it."
  - question: How do you connect an `<input>` to the `name` field?
    options: ['[formField]="profile.name"', 'formControlName="name"', '[(ngModel)]="name"', '[value]="profile.name()"']
    answer: 0
  - question: What happens when you change the model signal with `set()`?
    options:
      - Nothing – the form doesn't notice
      - The fields show the new values right away
      - The form is reset and becomes invalid
      - Angular throws an error
    answer: 1
exercise:
  example: ex-signal-form
  title: A Profile Form
  task: |-
    The inputs aren't connected to the model yet – the preview stays empty.

    1. Create a form `profile` with `form(this.model)`.
    2. Connect name, city and the checkbox with `[formField]`.
    3. Import `FormField` in the component.
  checks:
    input-updates-model: Typing a name and city shows up in the preview
    checkbox-updates-model: "The checkbox switches to “newsletter: yes”"
    model-updates-inputs: "**Fill example** fills in the fields"
---

# Signal Forms

Almost every application needs forms: sign-up, search, settings. Since version 21, Angular has **Signal Forms** for this. You describe your data as a signal, and Angular builds a form from it that always stays in sync with that signal.

> [!NOTE]
> Signal Forms are stable since Angular 22. The live examples run on Angular 21, where they are still marked *experimental*. The API is the same.

## The model

It all starts with a plain signal holding the form data:

```ts
interface Signup {
  name: string;
  email: string;
  weekly: boolean;
}

protected readonly model = signal<Signup>({ name: '', email: '', weekly: false });
```

`form()` turns this signal into a **field tree** with exactly the same fields as the model:

```ts
import { form, FormField } from '@angular/forms/signals';

protected readonly signupForm = form(this.model);
```

`signupForm.name`, `signupForm.email` and `signupForm.weekly` are now fields you can bind in the template. TypeScript knows them, so a typo like `signupForm.nmae` is caught right away.

## Binding fields

The `FormField` directive connects an input element to a field:

```html
<input [formField]="signupForm.name" />
<input type="email" [formField]="signupForm.email" />
<input type="checkbox" [formField]="signupForm.weekly" />
```

This works in **both directions**:

- When the user types, Angular writes the value into the model.
- When you change the model in code, for example with `model.set(...)`, the fields show the new values right away.

Text, numbers, checkboxes, `<select>` and `<textarea>` work without extra setup. With `type="number"` the model receives a number, not a string.

::tryit{forms-signal}

## Reading a field's state

Call a field like a function to get its **state**. Every property on it is a signal again:

| Signal | Meaning |
|---|---|
| `value()` | the current value |
| `touched()` | the user has left the field |
| `dirty()` | the user has changed the value |
| `valid()` / `invalid()` | validation passes (or not) |
| `errors()` | the list of errors |

```html
@if (signupForm.email().dirty()) {
  <small>You changed the email address.</small>
}
```

The whole form has a state too: `signupForm().valid()` is only `true` when every field is valid.

## Submitting

`submit()` runs your action, but only if the form is valid. Before that it marks all interactive fields as `touched`, so error messages appear:

```ts
protected onSubmit(event: Event): void {
  event.preventDefault(); // don't reload the page
  void submit(this.signupForm, async () => {
    await this.api.save(this.model());
    return undefined; // no errors from the server
  });
}
```

```html
<form (submit)="onSubmit($event)">…</form>
```

> [!TIP]
> You don't have to read the data out of the form first. It is already in the model signal: `this.model()` is always up to date.

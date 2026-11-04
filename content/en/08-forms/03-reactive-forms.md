---
title: Reactive Forms
minutes: 8
summary: |-
  - In Reactive Forms each field is a `FormControl`, and several make up a `FormGroup` – most conveniently via `inject(FormBuilder)`.
  - Each entry is `[initial value, validators]`. With `fb.nonNullable.group()`, `reset()` restores the initial values instead of `null`.
  - `[formGroup]` connects the `<form>`, `formControlName` each input. `ReactiveFormsModule` goes into the `imports`.
  - `(ngSubmit)` prevents the page reload by itself. Error names are lowercase: `required`, `email`, `minlength`.
  - `value`, `valid` and `touched` are not signals, changes arrive as observables (`valueChanges`, `statusChanges`).
  - Signal Forms are the first choice for new code. You'll find Reactive Forms and template-driven forms (`ngModel`) in existing projects.

  ```ts
  protected readonly contact = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });
  ```

  ```html
  <form [formGroup]="contact" (ngSubmit)="send()">
    <input formControlName="name" />
  </form>
  ```
quiz:
  - question: Which directive connects an `<input>` to a control in a `FormGroup`?
    options: ["formControlName", "[formField]", "ngModel", "[control]"]
    answer: 0
  - question: What does `fb.nonNullable.group(...)` do?
    options:
      - The fields must not be empty
      - "`reset()` sets the fields back to their initial values instead of `null`"
      - The form becomes read-only
      - It turns on validation
    answer: 1
  - question: Which kind of form does Angular recommend for new forms?
    options: ["Template-driven forms with ngModel", "Reactive Forms", "Signal Forms", "Custom event handlers"]
    answer: 2
    explanation: "Signal Forms are the first choice for new code. Reactive Forms stay important because a lot of existing code uses them."
exercise:
  example: ex-reactive-form
  title: A login with Reactive Forms
  task: |-
    Build the login form with Reactive Forms:

    1. Create a `FormGroup` `login` with `fb.nonNullable.group()`. `email` is required and a valid email address, `password` is required and has at least 6 characters.
    2. Import `ReactiveFormsModule`.
    3. Connect the `<form>` with `[formGroup]` and `(ngSubmit)="logIn()"`, and the inputs with `formControlName`.
    4. Disable the button while the form is invalid.
    5. In `logIn()`, show "Logged in as …" with the email address and reset the form.
  checks:
    disabled-when-empty: The button is disabled while the form is empty
    validators: An invalid email or a short password keeps the button disabled
    submit-and-reset: Submitting shows the email address and clears the form
---

# Reactive Forms

Before Signal Forms there were two ways to build forms: **Reactive Forms** and **template-driven forms**. You will find both in existing projects a lot, and Reactive Forms are the more common of the two. This lesson shows how they work and how they differ from Signal Forms.

## FormGroup and FormControl

With Reactive Forms you describe the form as objects in code. Each field is a `FormControl`, and several of them make up a `FormGroup`. The `FormBuilder` is the most convenient way to create them:

```ts
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

private readonly fb = inject(FormBuilder);

protected readonly contact = this.fb.nonNullable.group({
  name: ['', Validators.required],
  email: ['', [Validators.required, Validators.email]],
  message: ['', [Validators.required, Validators.minLength(10)]],
});
```

Each entry is `[initial value, validators]`. With `nonNullable`, `reset()` sets the fields back to their initial values; otherwise they would become `null`.

## Connecting the template

`[formGroup]` connects the `<form>` to the group, and `formControlName` connects each input to its control:

```html
<form [formGroup]="contact" (ngSubmit)="send()">
  <input formControlName="name" />
  @if (contact.controls.name.touched && contact.controls.name.hasError('required')) {
    <small>Please enter your name.</small>
  }
  <button type="submit" [disabled]="contact.invalid">Send</button>
</form>
```

- Don't forget: `ReactiveFormsModule` goes into the component's `imports`.
- `(ngSubmit)` prevents the page reload by itself. You don't need `preventDefault()` here.
- The error names are lowercase: `required`, `email`, `minlength`.

You read the value with `contact.value` or, fully typed, with `contact.getRawValue()`.

::tryit{forms-reactive}

> [!NOTE]
> In Reactive Forms, `value`, `valid` and `touched` are **not signals** but plain properties. Changes arrive as observables (`valueChanges`, `statusChanges`). That is clumsier in signal-based components, and it is exactly what Signal Forms solve.

## Template-driven forms

The third approach puts the whole form into the template, using `ngModel` from `FormsModule`:

```html
<input name="name" [(ngModel)]="name" required />
```

That is quick to write for very small forms, but validation and types are harder to control. For new code, Signal Forms are the better choice.

## Which one when?

| Aspect | Signal Forms | Reactive Forms | Template-driven |
|---|---|---|---|
| Data lives in | a signal | `FormGroup` objects | component fields |
| Rules live in | a schema function | code (`Validators`) | template attributes |
| State as | signals | properties and observables | properties |
| For new code | **first choice** | when the project already uses them | usually not the first choice |

> [!TIP]
> You don't have to rewrite existing Reactive Forms right away. Both approaches can live side by side in one project. Write new forms with Signal Forms.

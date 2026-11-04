---
title: Validation
minutes: 9
quiz:
  - question: Where do you define the rules with Signal Forms?
    options:
      - As attributes in the template, e.g. `required`
      - In a schema function, the second argument of `form()`
      - In a separate service
      - In the CSS file
    answer: 1
  - question: "The `password` field only has `minLength(path.password, 8)`. Is an empty password valid?"
    options: ["Yes", "No"]
    answer: 0
    explanation: "Length rules don't check empty values. If the field must be filled in, you also need `required()`."
  - question: How does a custom rule with `validate()` read the value of another field?
    options: ["With `this.model()`", "With `valueOf(path.otherField)`", "With `inject()`", "It can't"]
    answer: 1
exercise:
  example: ex-validation
  title: Validating a sign-up form
  task: |-
    The form accepts anything so far. Give `form()` a schema function as its second argument and add these rules:

    1. `email` is required and must be a valid email address.
    2. `password` is required and has at least 8 characters.
    3. `confirm` must equal `password`. Write a custom rule with `validate()` and the error `kind` `'mismatch'`.
  checks:
    email-required: An empty email shows a `required` error
    email-format: "`ada@` shows an `email` error"
    password-length: Passwords that are too short or empty are rejected
    passwords-match: Different passwords show `mismatch`, equal ones can be submitted
---

# Validation

A form should only accept data that is correct. With Signal Forms you define the rules **once**, in a schema function. Angular then checks again on every input and keeps `valid()` and `errors()` up to date.

## The schema function

`form()` takes a function as its second argument. It receives `path`, a description of all fields, and calls the rules on it:

```ts
import { email, form, min, minLength, required } from '@angular/forms/signals';

protected readonly reg = form(this.model, (path) => {
  required(path.name, { message: 'Please enter your name.' });
  required(path.email);
  email(path.email, { message: 'That is not a valid email address.' });
  min(path.age, 16, { message: 'You must be at least 16.' });
  minLength(path.password, 8);
});
```

The built-in rules:

| Rule | Error `kind` |
|---|---|
| `required(path)` | `required` |
| `email(path)` | `email` |
| `min(path, n)` / `max(path, n)` | `min` / `max` |
| `minLength(path, n)` / `maxLength(path, n)` | `minLength` / `maxLength` |
| `pattern(path, /regex/)` | `pattern` |

> [!WARNING]
> `minLength`, `email` and `pattern` don't check **empty** values. An empty password passes `minLength(8)`. If a field must be filled in, you also need `required()`.

## Showing errors

`errors()` returns a list of errors. Each one has a `kind` and, if you provided one, a `message`. Only show them once the user has left the field (`touched()`). Otherwise the form is full of errors as soon as it opens:

```html
<input [formField]="reg.email" />
@if (reg.email().touched() && reg.email().invalid()) {
  @for (error of reg.email().errors(); track error.kind) {
    <small class="error">{{ error.message }}</small>
  }
}
```

Because this repeats for every field, a small component that takes a field as input (`input.required<FieldTree<unknown>>()`) pays off. The example below does exactly that.

## Custom rules

For everything else there is `validate()`. The function receives the field's context and returns an error, or `undefined` when everything is fine. With `valueOf()` it reads the value of **another** field, for example for "repeat password":

```ts
validate(path.confirm, ({ value, valueOf }) =>
  value() !== valueOf(path.password)
    ? { kind: 'mismatch', message: 'The passwords do not match.' }
    : undefined,
);
```

Because `valueOf()` reads a signal, Angular re-runs the rule automatically whenever the password changes.

::tryit{forms-validation}

## Submitting with validation

`submit()` marks all interactive fields as `touched`, so all errors become visible. The action only runs when the form is valid. While it runs, `submitting()` is `true`. Use that to disable the button and prevent double submits:

```html
<button type="submit" [disabled]="reg().submitting()">
  {{ reg().submitting() ? 'Saving …' : 'Create account' }}
</button>
```

> [!NOTE]
> Just like router guards, validation in the browser does not replace checks on the server. It gives fast feedback, but the server must still enforce the rules itself.

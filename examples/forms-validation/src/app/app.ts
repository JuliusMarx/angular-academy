import { Component, signal } from '@angular/core';
import { email, form, FormField, min, minLength, required, submit, validate } from '@angular/forms/signals';
import { FieldErrors } from './field-errors';

interface Registration {
  name: string;
  email: string;
  age: number | null;
  password: string;
  confirm: string;
}

@Component({
  selector: 'app-root',
  imports: [FieldErrors, FormField],
  template: `
    <h1>Register</h1>

    <form (submit)="onSubmit($event)" novalidate>
      <p>
        <label>Name <input [formField]="reg.name" /></label>
        <app-field-errors [field]="reg.name" />
      </p>
      <p>
        <label>Email <input type="email" [formField]="reg.email" /></label>
        <app-field-errors [field]="reg.email" />
      </p>
      <p>
        <label>Age <input type="number" [formField]="reg.age" /></label>
        <app-field-errors [field]="reg.age" />
      </p>
      <p>
        <label>Password <input type="password" [formField]="reg.password" /></label>
        <app-field-errors [field]="reg.password" />
      </p>
      <p>
        <label>Repeat password <input type="password" [formField]="reg.confirm" /></label>
        <app-field-errors [field]="reg.confirm" />
      </p>

      <button type="submit" [disabled]="reg().submitting()">
        {{ reg().submitting() ? 'Saving …' : 'Create account' }}
      </button>
      <p>Form valid: {{ reg().valid() }}</p>
    </form>

    @if (done()) {
      <p class="success">Account created.</p>
    }
  `,
  styles: `
    .success {
      color: #1e7f4f;
    }
  `,
})
export class App {
  protected readonly model = signal<Registration>({ name: '', email: '', age: null, password: '', confirm: '' });

  /** The schema function declares all rules once – Angular keeps the state up to date. */
  protected readonly reg = form(this.model, (path) => {
    required(path.name, { message: 'Please enter your name.' });
    required(path.email, { message: 'Please enter your email.' });
    email(path.email, { message: 'That is not a valid email address.' });
    required(path.age, { message: 'Please enter your age.' });
    min(path.age, 16, { message: 'You must be at least 16.' });
    required(path.password, { message: 'Please choose a password.' });
    minLength(path.password, 8, { message: 'At least 8 characters.' }); // empty values pass minLength – hence required
    // A custom rule that compares two fields
    validate(path.confirm, ({ value, valueOf }) =>
      value() !== valueOf(path.password) ? { kind: 'mismatch', message: 'The passwords do not match.' } : undefined,
    );
  });

  protected readonly done = signal(false);

  protected onSubmit(event: Event): void {
    event.preventDefault();
    // submit() marks all fields as touched (so errors show) and only runs the action when valid.
    void submit(this.reg, async () => {
      await new Promise((r) => setTimeout(r, 800)); // pretend to call a server
      this.done.set(true);
      return undefined;
    });
  }
}

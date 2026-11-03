import { Component, signal } from '@angular/core';
import { form, FormField, submit } from '@angular/forms/signals';

interface SignUp {
  email: string;
  password: string;
  confirm: string;
}

@Component({
  selector: 'app-root',
  imports: [FormField],
  template: `
    <h1>Sign up</h1>

    <form (submit)="onSubmit($event)" novalidate>
      <p>
        <label>Email <input id="email" type="email" [formField]="signUp.email" /></label>
        <span id="email-errors">
          @if (signUp.email().touched()) {
            @for (e of signUp.email().errors(); track e.kind) {
              <small class="error" [attr.data-kind]="e.kind">{{ e.message ?? e.kind }}</small>
            }
          }
        </span>
      </p>
      <p>
        <label>Password <input id="password" type="password" [formField]="signUp.password" /></label>
        <span id="password-errors">
          @if (signUp.password().touched()) {
            @for (e of signUp.password().errors(); track e.kind) {
              <small class="error" [attr.data-kind]="e.kind">{{ e.message ?? e.kind }}</small>
            }
          }
        </span>
      </p>
      <p>
        <label>Repeat password <input id="confirm" type="password" [formField]="signUp.confirm" /></label>
        <span id="confirm-errors">
          @if (signUp.confirm().touched()) {
            @for (e of signUp.confirm().errors(); track e.kind) {
              <small class="error" [attr.data-kind]="e.kind">{{ e.message ?? e.kind }}</small>
            }
          }
        </span>
      </p>
      <button type="submit">Sign up</button>
    </form>

    <p id="result">{{ welcome() }}</p>
  `,
  styles: `
    .error {
      display: block;
      color: #b3261e;
    }
  `,
})
export class App {
  protected readonly model = signal<SignUp>({ email: '', password: '', confirm: '' });

  // TODO: add a schema function as the second argument of form():
  //   1. email is required and must be a valid email address
  //   2. password needs at least 8 characters (and is required)
  //   3. confirm must match password – a custom rule with validate(), kind 'mismatch'
  protected readonly signUp = form(this.model);

  protected readonly welcome = signal('');

  protected onSubmit(event: Event): void {
    event.preventDefault();
    void submit(this.signUp, async () => {
      this.welcome.set(`Welcome, ${this.model().email}!`);
      return undefined;
    });
  }
}

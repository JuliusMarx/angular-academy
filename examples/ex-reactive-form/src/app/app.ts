import { Component, inject, signal } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-root',
  // TODO 2: import ReactiveFormsModule
  imports: [],
  template: `
    <h1>Log in</h1>

    <!-- TODO 3: connect the form with [formGroup] and (ngSubmit), the inputs with formControlName -->
    <form>
      <p><label>Email <input id="email" type="email" /></label></p>
      <p><label>Password <input id="password" type="password" /></label></p>
      <!-- TODO 4: disable the button while the form is invalid -->
      <button type="submit">Log in</button>
    </form>

    <p id="result">{{ user() }}</p>
  `,
})
export class App {
  private readonly fb = inject(FormBuilder);

  // TODO 1: create a FormGroup with fb.nonNullable.group():
  //   email: required and a valid email · password: required, at least 6 characters

  protected readonly user = signal('');

  protected logIn(): void {
    // TODO 5: show "Logged in as <email>" in user and reset the form
  }
}

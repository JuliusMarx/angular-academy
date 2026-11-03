import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  template: `
    <h1>Log in</h1>

    <form [formGroup]="login" (ngSubmit)="logIn()">
      <p><label>Email <input id="email" type="email" formControlName="email" /></label></p>
      <p><label>Password <input id="password" type="password" formControlName="password" /></label></p>
      <button type="submit" [disabled]="login.invalid">Log in</button>
    </form>

    <p id="result">{{ user() }}</p>
  `,
})
export class App {
  private readonly fb = inject(FormBuilder);

  protected readonly login = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  protected readonly user = signal('');

  protected logIn(): void {
    this.user.set(`Logged in as ${this.login.getRawValue().email}`);
    this.login.reset();
  }
}

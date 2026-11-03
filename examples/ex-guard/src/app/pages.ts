import { Component, inject } from '@angular/core';
import { AuthService } from './auth';

@Component({ selector: 'app-home', template: `<h1>Home</h1>` })
export class Home {}

@Component({
  selector: 'app-login',
  template: `
    <h1>Login</h1>
    <button type="button" (click)="auth.loggedIn.set(true)">Log in</button>
  `,
})
export class Login {
  protected readonly auth = inject(AuthService);
}

@Component({ selector: 'app-admin', template: `<h1>Admin</h1><p>Secret settings.</p>` })
export class Admin {}

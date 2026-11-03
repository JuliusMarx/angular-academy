import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, Profile } from './auth';

@Component({
  selector: 'app-home',
  template: `<h1>Home</h1><p>Try "Account" while logged out.</p>`,
})
export class Home {}

@Component({
  selector: 'app-login',
  template: `
    <h1>Login</h1>
    <p>You need to log in to see this page.</p>
    <button type="button" (click)="login()">Log in</button>
  `,
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  /** Query parameter ?returnUrl=… set by the guard. */
  readonly returnUrl = input('/');

  protected login(): void {
    this.auth.loggedIn.set(true);
    void this.router.navigateByUrl(this.returnUrl());
  }
}

@Component({
  selector: 'app-account',
  template: `
    <h1>Account</h1>
    <!-- "profile" is the resolver's result – bound as an input like a route parameter -->
    <p>Hello {{ profile().name }}, you have {{ profile().orders }} orders.</p>
  `,
})
export class Account {
  readonly profile = input.required<Profile>();
}

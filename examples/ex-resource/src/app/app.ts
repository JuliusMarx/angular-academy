import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <h1>User</h1>

    <p>
      <button type="button" (click)="userId.set(1)">User 1</button>
      <button type="button" (click)="userId.set(2)">User 2</button>
      <button type="button" (click)="userId.set(99)">User 99</button>
    </p>

    <!-- TODO 2: show
         - <p id="loading">Loading …</p> while the user is loading,
         - <p id="error">…</p> with the error message if loading failed,
         - <h2 id="name">…</h2> with the user's name once it has loaded. -->
  `,
})
export class App {
  protected readonly userId = signal(1);

  // TODO 1: create a resource() that loads the user with fetchUser() from ./user-api
  //         whenever userId() changes.
}

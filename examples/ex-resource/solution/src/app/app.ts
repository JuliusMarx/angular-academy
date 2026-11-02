import { Component, resource, signal } from '@angular/core';
import { fetchUser } from './user-api';

@Component({
  selector: 'app-root',
  template: `
    <h1>User</h1>

    <p>
      <button type="button" (click)="userId.set(1)">User 1</button>
      <button type="button" (click)="userId.set(2)">User 2</button>
      <button type="button" (click)="userId.set(99)">User 99</button>
    </p>

    @if (user.isLoading()) {
      <p id="loading">Loading …</p>
    } @else if (user.error(); as error) {
      <p id="error">{{ error.message }}</p>
    } @else if (user.hasValue()) {
      <h2 id="name">{{ user.value().name }}</h2>
    }
  `,
})
export class App {
  protected readonly userId = signal(1);

  protected readonly user = resource({
    params: () => ({ id: this.userId() }),
    loader: ({ params, abortSignal }) => fetchUser(params.id, abortSignal),
  });
}

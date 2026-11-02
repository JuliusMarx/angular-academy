import { Component, resource, signal } from '@angular/core';
import { fetchUser } from './user-api';

@Component({
  selector: 'app-root',
  template: `
    <h1>User profile</h1>

    <p>
      @for (id of [1, 2, 3, 99]; track id) {
        <button type="button" [disabled]="id === userId()" (click)="userId.set(id)">User {{ id }}</button>
      }
      <button type="button" (click)="user.reload()">Reload</button>
    </p>

    <p>Status: <code>{{ user.status() }}</code></p>

    @if (user.isLoading()) {
      <p>Loading …</p>
    } @else if (user.error()) {
      <p style="color: crimson">Error: {{ user.error()?.message }}</p>
    } @else if (user.hasValue()) {
      <h2>{{ user.value().name }}</h2>
      <p>{{ user.value().email }}</p>
    }
  `,
})
export class App {
  protected readonly userId = signal(1);

  // Loads again automatically whenever userId() changes.
  protected readonly user = resource({
    params: () => ({ id: this.userId() }),
    loader: ({ params, abortSignal }) => fetchUser(params.id, abortSignal),
  });
}

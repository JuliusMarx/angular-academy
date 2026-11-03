import { httpResource } from '@angular/common/http';
import { Component, signal } from '@angular/core';

interface User {
  id: number;
  name: string;
  city: string;
}

@Component({
  selector: 'app-root',
  template: `
    <h1>User {{ id() }}</h1>

    <button type="button" (click)="id.set(id() - 1)" [disabled]="id() === 1">Previous</button>
    <button type="button" (click)="id.set(id() + 1)">Next</button>

    <section id="user">
      @if (user.isLoading()) {
        <p>Loading …</p>
      } @else if (user.error()) {
        <p>User could not be loaded.</p>
      } @else if (user.hasValue()) {
        <p>{{ user.value().name }} from {{ user.value().city }}</p>
      }
    </section>
  `,
})
export class App {
  protected readonly id = signal(1);

  protected readonly user = httpResource<User>(() => `/api/users/${this.id()}.json`);
}

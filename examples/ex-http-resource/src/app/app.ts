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
      <!-- TODO 2: show "Loading …", the error text "User could not be loaded."
           or the user's name and city -->
    </section>
  `,
})
export class App {
  protected readonly id = signal(1);

  // TODO 1: load the user from `/api/users/<id>.json` with httpResource<User>()
}

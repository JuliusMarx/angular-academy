import { Component, signal } from '@angular/core';
import { Stepper } from './stepper';

@Component({
  selector: 'app-root',
  imports: [Stepper],
  template: `
    <h1>Guests</h1>

    <app-stepper [(value)]="guests" />

    <p>Parent sees: <span id="parent-value">{{ guests() }}</span></p>
    <button type="button" (click)="guests.set(5)">Set to 5</button>
  `,
})
export class App {
  protected readonly guests = signal(2);
}

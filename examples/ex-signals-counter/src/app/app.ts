import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <h1>Counter: <span id="count">{{ count() }}</span></h1>

    <button type="button" (click)="decrement()">−</button>
    <button type="button" (click)="increment()">+</button>

    <!-- TODO 1: show the square of the counter here: <p id="squared">Squared: …</p> -->
    <!-- TODO 2: add a button "Reset" that sets the counter back to 0 -->
  `,
})
export class App {
  protected readonly count = signal(0);

  // TODO 1: add a computed signal "squared"

  protected increment(): void {
    this.count.update((n) => n + 1);
  }

  protected decrement(): void {
    this.count.update((n) => n - 1);
  }
}

import { Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <h1>Counter: <span id="count">{{ count() }}</span></h1>

    <button type="button" (click)="decrement()">−</button>
    <button type="button" (click)="increment()">+</button>

    <p id="squared">Squared: {{ squared() }}</p>
    <button type="button" (click)="count.set(0)">Reset</button>
  `,
})
export class App {
  protected readonly count = signal(0);
  protected readonly squared = computed(() => this.count() * this.count());

  protected increment(): void {
    this.count.update((n) => n + 1);
  }

  protected decrement(): void {
    this.count.update((n) => n - 1);
  }
}

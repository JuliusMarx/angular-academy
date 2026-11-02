import { Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <h1>Counter: {{ count() }}</h1>
    <p>Doubled: {{ doubled() }} · {{ isEven() ? 'even' : 'odd' }}</p>

    <button type="button" (click)="decrement()">−</button>
    <button type="button" (click)="increment()">+</button>
    <button type="button" (click)="count.set(0)">Reset</button>

    <!-- Try it: add a computed signal "squared" and display it -->
  `,
})
export class App {
  protected readonly count = signal(0);
  protected readonly doubled = computed(() => this.count() * 2);
  protected readonly isEven = computed(() => this.count() % 2 === 0);

  protected increment(): void {
    this.count.update((n) => n + 1);
  }

  protected decrement(): void {
    this.count.update((n) => n - 1);
  }
}

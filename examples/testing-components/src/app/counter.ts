import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-counter',
  template: `
    <button type="button" (click)="change(-1)" [disabled]="count() === 0">−</button>
    <output>{{ count() }}</output>
    <button type="button" (click)="change(1)" [disabled]="count() === max()">+</button>
  `,
})
export class Counter {
  readonly max = input(10);
  readonly changed = output<number>();
  protected readonly count = signal(0);

  protected change(delta: number): void {
    this.count.update((c) => c + delta);
    this.changed.emit(this.count());
  }
}

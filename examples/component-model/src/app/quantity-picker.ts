import { Component, input, model } from '@angular/core';

@Component({
  selector: 'app-quantity-picker',
  template: `
    <button type="button" [disabled]="value() <= min()" (click)="change(-1)">−</button>
    <output>{{ value() }}</output>
    <button type="button" [disabled]="value() >= max()" (click)="change(1)">+</button>
  `,
  styles: `
    output {
      display: inline-block;
      min-width: 2rem;
      text-align: center;
    }
  `,
})
export class QuantityPicker {
  /** A writable signal: changing it here also updates the parent's [(value)] binding. */
  readonly value = model(1);
  readonly min = input(1);
  readonly max = input(99);

  protected change(delta: number): void {
    // [disabled] alone is no guarantee (fast clicks, keyboard) – enforce the limits here too.
    this.value.update((v) => Math.min(this.max(), Math.max(this.min(), v + delta)));
  }
}

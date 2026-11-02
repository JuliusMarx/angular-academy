import { Component, model } from '@angular/core';

@Component({
  selector: 'app-stepper',
  template: `
    <button type="button" (click)="change(-1)">−</button>
    <output id="child-value">{{ value() }}</output>
    <button type="button" (click)="change(1)">+</button>
  `,
})
export class Stepper {
  readonly value = model(0);

  protected change(delta: number): void {
    this.value.update((v) => v + delta);
  }
}

import { Component, input } from '@angular/core';

@Component({
  selector: 'app-stepper',
  template: `
    <button type="button" (click)="change(-1)">−</button>
    <output id="child-value">{{ value() }}</output>
    <button type="button" (click)="change(1)">+</button>
  `,
})
export class Stepper {
  // TODO 1: turn this input into a model() so the stepper can change the value itself
  readonly value = input(0);

  protected change(delta: number): void {
    // TODO 2: update the value by delta
  }
}

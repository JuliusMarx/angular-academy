import { Component, model } from '@angular/core';

@Component({
  selector: 'app-toggle-switch',
  template: `
    <button
      type="button"
      role="switch"
      [attr.aria-checked]="checked()"
      [class.on]="checked()"
      (click)="checked.set(!checked())"
    >
      <span></span>
    </button>
  `,
  styles: `
    button {
      position: relative;
      width: 2.6rem;
      height: 1.5rem;
      padding: 0;
      border: none;
      border-radius: 1rem;
      background: #bbb;
      vertical-align: middle;
      cursor: pointer;
    }
    span {
      position: absolute;
      top: 0.2rem;
      left: 0.2rem;
      width: 1.1rem;
      height: 1.1rem;
      border-radius: 50%;
      background: white;
      transition: left 0.15s;
    }
    .on {
      background: #c2185b;
    }
    .on span {
      left: 1.3rem;
    }
  `,
})
export class ToggleSwitch {
  readonly checked = model(false);
}

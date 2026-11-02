import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <h1>Hello, {{ name() }}!</h1>

    <input id="name" placeholder="Your name" [value]="name()" (input)="onInput($event)" />

    <button type="button" id="clear" [disabled]="name() === ''" (click)="name.set('')">Clear</button>
  `,
})
export class App {
  protected readonly name = signal('');

  protected onInput(event: Event): void {
    this.name.set((event.target as HTMLInputElement).value);
  }
}

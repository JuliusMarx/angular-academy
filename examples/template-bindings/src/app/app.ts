import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <h1>Hello, {{ name() }}!</h1>
    <p>Your name has {{ name().length }} characters.</p>

    <!-- Property binding: [value] -->
    <!-- Event binding: (input) -->
    <label>
      Name:
      <input [value]="name()" (input)="onInput($event)" />
    </label>

    <p>
      <button type="button" [disabled]="name() === ''" (click)="name.set('')">Clear</button>
    </p>

    <img [src]="logoUrl" [alt]="'Angular logo'" width="80" />
  `,
})
export class App {
  protected readonly name = signal('Angular');
  protected readonly logoUrl = 'https://angular.dev/assets/images/press-kit/angular_icon_gradient.gif';

  protected onInput(event: Event): void {
    this.name.set((event.target as HTMLInputElement).value);
  }
}

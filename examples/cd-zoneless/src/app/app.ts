import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <h1>Change detection without Zone.js</h1>

    <p>Plain field: <strong id="plain">{{ plainCount }}</strong></p>
    <button type="button" (click)="incrementPlainLater()">+1 to the field in 1 s</button>

    <p>Signal: <strong id="signal">{{ signalCount() }}</strong></p>
    <button type="button" (click)="incrementSignalLater()">+1 to the signal in 1 s</button>

    <p><button type="button" (click)="doNothing()">Click me (empty handler)</button></p>

    <p>
      After the timer, the signal shows its new value right away. The plain field changes too, but
      Angular doesn't know – you only see it once something else triggers an update, e.g. an event handled by Angular.
    </p>
  `,
})
export class App {
  protected plainCount = 0;
  protected readonly signalCount = signal(0);

  protected incrementPlainLater(): void {
    setTimeout(() => this.plainCount++, 1000); // Angular doesn't notice this …
  }

  /** Any event Angular handles – even with an empty handler – triggers an update. */
  protected doNothing(): void {}

  protected incrementSignalLater(): void {
    setTimeout(() => this.signalCount.update((n) => n + 1), 1000); // … but this schedules an update.
  }
}

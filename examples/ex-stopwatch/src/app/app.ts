import { Component, DestroyRef, inject, signal } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  template: `
    <h1>Stopwatch</h1>
    <p id="ticks">{{ ticks() }}</p>
    <button type="button" (click)="start()">Start</button>
    <button type="button" (click)="stop()">Stop</button>
  `,
})
export class App {
  protected readonly ticks = signal(0);
  private subscription?: Subscription;

  constructor() {
    // TODO 4: unsubscribe when the component is destroyed (DestroyRef.onDestroy)
  }

  protected start(): void {
    // TODO 1: subscribe to interval(100) and add 1 to ticks on every value
    // TODO 3: a second click on Start must not start a second interval
  }

  protected stop(): void {
    // TODO 2: unsubscribe, so the ticks stop
  }
}

import { Component, DestroyRef, inject, signal } from '@angular/core';
import { interval, Subscription } from 'rxjs';

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
    inject(DestroyRef).onDestroy(() => this.subscription?.unsubscribe());
  }

  protected start(): void {
    if (this.subscription && !this.subscription.closed) return;
    this.subscription = interval(100).subscribe(() => this.ticks.update((t) => t + 1));
  }

  protected stop(): void {
    this.subscription?.unsubscribe();
  }
}

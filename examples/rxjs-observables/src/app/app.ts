import { Component, DestroyRef, inject, signal } from '@angular/core';
import { interval, Observable, Subscription } from 'rxjs';

/** A hand-made observable: emits three values, then completes. */
const countdown$ = new Observable<string>((subscriber) => {
  subscriber.next('3');
  const t1 = setTimeout(() => subscriber.next('2'), 500);
  const t2 = setTimeout(() => subscriber.next('1'), 1000);
  const t3 = setTimeout(() => subscriber.complete(), 1500);
  // Runs on unsubscribe or after complete – clean up what you started.
  return () => [t1, t2, t3].forEach(clearTimeout);
});

@Component({
  selector: 'app-root',
  template: `
    <h1>Observables</h1>

    <h2>Stopwatch</h2>
    <p>{{ seconds() }} s</p>
    <button type="button" (click)="start()" [disabled]="running()">Start</button>
    <button type="button" (click)="stop()" [disabled]="!running()">Stop</button>

    <h2>Countdown</h2>
    <button type="button" (click)="runCountdown()">Subscribe</button>
    <ol>
      @for (line of log(); track $index) {
        <li>{{ line }}</li>
      }
    </ol>
  `,
})
export class App {
  protected readonly seconds = signal(0);
  protected readonly running = signal(false);
  protected readonly log = signal<string[]>([]);

  private subscription?: Subscription;

  constructor() {
    // Stop the stopwatch when the component is destroyed – otherwise the interval keeps running.
    inject(DestroyRef).onDestroy(() => this.subscription?.unsubscribe());
  }

  protected start(): void {
    // interval() emits 0, 1, 2 … – but only once someone subscribes.
    this.subscription = interval(1000).subscribe(() => this.seconds.update((s) => s + 1));
    this.running.set(true);
  }

  protected stop(): void {
    this.subscription?.unsubscribe();
    this.running.set(false);
  }

  protected runCountdown(): void {
    this.log.set([]);
    countdown$.subscribe({
      next: (value) => this.log.update((l) => [...l, `next: ${value}`]),
      error: (err) => this.log.update((l) => [...l, `error: ${err}`]),
      complete: () => this.log.update((l) => [...l, 'complete']),
    });
  }
}

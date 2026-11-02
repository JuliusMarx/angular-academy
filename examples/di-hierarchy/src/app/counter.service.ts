import { Injectable, signal } from '@angular/core';

let nextId = 1;

@Injectable({ providedIn: 'root' })
export class CounterService {
  /** Shows which instance a component got. */
  readonly instanceId = nextId++;
  readonly count = signal(0);

  increment(): void {
    this.count.update((n) => n + 1);
  }
}

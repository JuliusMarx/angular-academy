import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ScoreService {
  readonly score = signal(0);

  add(points: number): void {
    this.score.update((s) => s + points);
  }

  reset(): void {
    this.score.set(0);
  }
}

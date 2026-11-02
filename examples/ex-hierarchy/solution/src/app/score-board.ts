import { Component, inject, input } from '@angular/core';
import { ScoreService } from './score.service';

@Component({
  selector: 'app-score-buttons',
  template: `
    <button type="button" (click)="scores.add(1)">+1</button>
    <button type="button" (click)="scores.reset()">Reset</button>
  `,
})
export class ScoreButtons {
  protected readonly scores = inject(ScoreService);
}

@Component({
  selector: 'app-score-board',
  imports: [ScoreButtons],
  // Every board gets its own instance; its child ScoreButtons finds it as the nearest provider.
  providers: [ScoreService],
  template: `
    <section>
      <h2>{{ team() }}: <span class="score">{{ scores.score() }}</span></h2>
      <app-score-buttons />
    </section>
  `,
})
export class ScoreBoard {
  readonly team = input.required<string>();
  protected readonly scores = inject(ScoreService);
}

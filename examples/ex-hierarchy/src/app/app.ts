import { Component } from '@angular/core';
import { ScoreBoard } from './score-board';

@Component({
  selector: 'app-root',
  imports: [ScoreBoard],
  template: `
    <h1>Match</h1>
    <app-score-board id="team-a" team="Team A" />
    <app-score-board id="team-b" team="Team B" />
  `,
})
export class App {}

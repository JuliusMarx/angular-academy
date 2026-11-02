import { Component, signal } from '@angular/core';
import { StarRating } from './star-rating';

@Component({
  selector: 'app-root',
  imports: [StarRating],
  template: `
    <h1>How do you like this course?</h1>

    <!-- (rated) listens to the child's output, $event is the emitted value -->
    <app-star-rating (rated)="onRated($event)" (cleared)="rating.set(null)" />

    @if (rating(); as stars) {
      <p>Thanks for {{ stars }} {{ stars === 1 ? 'star' : 'stars' }}!</p>
    } @else {
      <p>No rating yet.</p>
    }

    <h2>Log</h2>
    <ul>
      @for (entry of log(); track $index) {
        <li>{{ entry }}</li>
      }
    </ul>
  `,
})
export class App {
  protected readonly rating = signal<number | null>(null);
  protected readonly log = signal<string[]>([]);

  protected onRated(stars: number): void {
    this.rating.set(stars);
    this.log.update((entries) => [...entries, `rated: ${stars}`]);
  }
}

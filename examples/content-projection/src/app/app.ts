import { Component } from '@angular/core';
import { Card } from './card';

@Component({
  selector: 'app-root',
  imports: [Card],
  template: `
    <h1>Content projection</h1>

    <app-card>
      <h2 card-title>Angular Academy</h2>
      <p>Everything without a matching slot lands in the default slot.</p>
      <p>You can put <strong>any markup</strong> here – even other components.</p>
      <button card-footer type="button">Start learning</button>
    </app-card>

    <app-card>
      <h2 card-title>Without a footer</h2>
      <p>The footer slot is empty, so the card shows its fallback content.</p>
    </app-card>

    <!-- Try it: add a third slot "card-badge" to card.ts and fill it here -->
  `,
  // Projected elements belong to this component, so they are styled here – not in card.ts.
  styles: `
    h2 {
      margin: 0;
      font-size: 1.1rem;
    }
  `,
})
export class App {}

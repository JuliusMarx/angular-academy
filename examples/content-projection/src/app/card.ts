import { Component } from '@angular/core';

@Component({
  selector: 'app-card',
  template: `
    <section>
      <header>
        <!-- Only elements with the card-title attribute -->
        <ng-content select="[card-title]" />
      </header>

      <div class="body">
        <!-- Everything else (default slot) -->
        <ng-content />
      </div>

      <footer>
        <ng-content select="[card-footer]">
          <!-- Fallback: shown when nothing is projected into this slot -->
          <small>No actions</small>
        </ng-content>
      </footer>
    </section>
  `,
  styles: `
    section {
      max-width: 24rem;
      margin-bottom: 1rem;
      border: 1px solid #ccc;
      border-radius: 0.5rem;
      overflow: hidden;
    }
    header {
      padding: 0.5rem 1rem;
      background: #fce4ee;
    }
    .body {
      padding: 0 1rem;
    }
    footer {
      padding: 0.5rem 1rem;
      border-top: 1px solid #eee;
    }
  `,
})
export class Card {}

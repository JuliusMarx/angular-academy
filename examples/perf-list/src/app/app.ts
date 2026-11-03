import { Component, computed, signal } from '@angular/core';
import { filterProducts, PRODUCTS, stats } from './products';
import { Reviews } from './reviews';

@Component({
  selector: 'app-root',
  imports: [Reviews],
  template: `
    <h1>Shop</h1>

    <label>Filter <input [value]="query()" (input)="query.set($any($event.target).value)" /></label>
    <button type="button" (click)="likes.set(likes() + 1)">❤ {{ likes() }}</button>

    <!-- track p.id: Angular keeps each element when the list changes -->
    <ul>
      @for (p of visible(); track p.id) {
        <li>{{ p.name }}</li>
      }
    </ul>

    <!-- Shown after the list, so the count is up to date. -->
    <p><small>The filter ran {{ filterRuns() }} times. Click ❤ – the number stays the same.</small></p>

    <h2>Reviews</h2>
    @defer (on interaction) {
      <app-reviews />
    } @placeholder {
      <button type="button">Show reviews</button>
    } @loading (minimum 300ms) {
      <p>Loading …</p>
    }
  `,
})
export class App {
  protected readonly query = signal('');
  protected readonly likes = signal(0);

  /** computed() caches the result – it only filters again when query() changes. */
  protected readonly visible = computed(() => filterProducts(PRODUCTS, this.query()));
  protected readonly filterRuns = computed(() => (this.visible(), stats.filterRuns));
}

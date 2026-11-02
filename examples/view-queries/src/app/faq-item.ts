import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-faq-item',
  template: `
    <div class="item">
      <button type="button" [attr.aria-expanded]="open()" (click)="open.set(!open())">
        {{ open() ? '▾' : '▸' }} {{ question() }}
      </button>
      @if (open()) {
        <p>{{ answer() }}</p>
      }
    </div>
  `,
  styles: `
    .item {
      border-bottom: 1px solid #eee;
    }
    button {
      width: 100%;
      padding: 0.6rem 0;
      border: none;
      background: none;
      text-align: left;
      font: inherit;
      font-weight: 600;
      cursor: pointer;
    }
    p {
      margin: 0 0 0.75rem 1.2rem;
    }
  `,
})
export class FaqItem {
  readonly question = input.required<string>();
  readonly answer = input.required<string>();
  /** Public so the parent can open or close the item through a view query. */
  readonly open = signal(false);
}

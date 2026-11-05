import { Component, input, signal } from '@angular/core';

let nextId = 0;

@Component({
  selector: 'app-faq-item',
  template: `
    <h3>
      <button type="button" [attr.aria-expanded]="open()" [attr.aria-controls]="answerId" (click)="open.set(!open())">
        {{ question() }}
      </button>
    </h3>
    <div class="answer" [id]="answerId" [hidden]="!open()">
      <ng-content />
    </div>
  `,
  styles: `
    h3 {
      margin: 0;
    }
    button {
      display: block;
      width: 100%;
      padding: 0.75rem;
      border: 0;
      border-block-end: 1px solid #ccc;
      background: none;
      font: inherit;
      text-align: start;
      cursor: pointer;
    }
    .answer {
      padding: 0.75rem;
    }
  `,
})
export class FaqItem {
  readonly question = input.required<string>();
  protected readonly open = signal(false);
  protected readonly answerId = `faq-answer-${nextId++}`;
}

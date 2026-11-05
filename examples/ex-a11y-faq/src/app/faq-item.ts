import { Component, input, signal } from '@angular/core';

// TODO 3: add a counter here (let nextId = 0;), so every FaqItem gets its own answer id

@Component({
  selector: 'app-faq-item',
  template: `
    <h3>
      <!-- TODO 1: replace this div with a <button type="button"> (keep the (click)) -->
      <!-- TODO 2: bind aria-expanded to open() -->
      <!-- TODO 3: bind aria-controls to the id of the answer below -->
      <div class="question" (click)="open.set(!open())">{{ question() }}</div>
    </h3>
    <!-- TODO 3: give the answer its id -->
    <div class="answer" [hidden]="!open()">
      <ng-content />
    </div>
  `,
  styles: `
    h3 {
      margin: 0;
    }
    .question,
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
}

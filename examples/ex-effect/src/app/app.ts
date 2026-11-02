import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <h1>Draft</h1>
    <textarea id="draft" rows="4" cols="40" [value]="draft()" (input)="onInput($event)"></textarea>
    <p>{{ draft().length }} characters</p>
  `,
})
export class App {
  protected readonly draft = signal('');

  constructor() {
    // TODO: add an effect() that saves the draft to localStorage under the key "draft"
    //       every time it changes: localStorage.setItem('draft', …)
  }

  protected onInput(event: Event): void {
    this.draft.set((event.target as HTMLTextAreaElement).value);
  }
}

import { Component, effect, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <h1>Notes</h1>
    <p>Your note is saved to localStorage automatically – reload the preview to check.</p>

    <textarea rows="5" cols="40" [value]="note()" (input)="onInput($event)"></textarea>

    <p>
      <label>
        <input type="checkbox" [checked]="logging()" (change)="logging.set(!logging())" />
        Log changes to the console
      </label>
    </p>
  `,
})
export class App {
  protected readonly note = signal(localStorage.getItem('note') ?? '');
  protected readonly logging = signal(true);

  constructor() {
    // Runs once initially and again whenever note() changes.
    effect(() => {
      localStorage.setItem('note', this.note());
    });

    // Reads two signals – it re-runs when either of them changes.
    effect((onCleanup) => {
      if (!this.logging()) return;
      const text = this.note();
      const timer = setTimeout(() => console.log('Note changed:', text), 300);
      // Cancel the pending log when the effect runs again (a simple debounce).
      onCleanup(() => clearTimeout(timer));
    });
  }

  protected onInput(event: Event): void {
    this.note.set((event.target as HTMLTextAreaElement).value);
  }
}

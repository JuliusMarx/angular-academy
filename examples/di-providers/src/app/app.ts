import { Component, inject, signal } from '@angular/core';
import { Logger, MemoryLogger } from './logger';
import { APP_SETTINGS } from './tokens';

@Component({
  selector: 'app-root',
  template: `
    <h1>{{ settings.appName }}</h1>
    <p>Items: {{ items() }} / {{ settings.maxItems }}</p>
    <button type="button" [disabled]="items() >= settings.maxItems" (click)="addItem()">Add item</button>

    <h2>Log</h2>
    @if (memory) {
      <ul>
        @for (m of memory.messages(); track $index) {
          <li>{{ m }}</li>
        }
      </ul>
    } @else {
      <p>The logger isn't a MemoryLogger – open the console.</p>
    }
  `,
})
export class App {
  private readonly logger = inject(Logger);
  protected readonly settings = inject(APP_SETTINGS);
  /** optional: true → null instead of an error when nothing provides MemoryLogger. */
  protected readonly memory = inject(MemoryLogger, { optional: true });
  protected readonly items = signal(0);

  constructor() {
    this.logger.log('App started');
  }

  protected addItem(): void {
    if (this.items() >= this.settings.maxItems) return;
    this.items.update((n) => n + 1);
    this.logger.log(`Item ${this.items()} added`);
  }
}

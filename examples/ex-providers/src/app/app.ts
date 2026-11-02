import { Component, inject } from '@angular/core';
import { APP_NAME, Logger, MemoryLogger } from './logger';

@Component({
  selector: 'app-root',
  template: `
    <h1>{{ appName }}</h1>
    <button type="button" (click)="save()">Save</button>

    <h2>Log</h2>
    <ul id="log">
      @for (m of messages(); track $index) {
        <li>{{ m }}</li>
      }
    </ul>
  `,
})
export class App {
  private readonly logger = inject(Logger);
  protected readonly appName = inject(APP_NAME);

  /** Only a MemoryLogger keeps messages we can show. */
  protected messages() {
    return this.logger instanceof MemoryLogger ? this.logger.messages() : [];
  }

  protected save(): void {
    this.logger.log('Saved');
  }
}

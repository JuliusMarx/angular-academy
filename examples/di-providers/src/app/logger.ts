import { Injectable, signal } from '@angular/core';

/** The "contract": components only depend on this abstract class, not on an implementation. */
export abstract class Logger {
  abstract log(message: string): void;
}

/** Writes to the browser console. */
@Injectable()
export class ConsoleLogger extends Logger {
  log(message: string): void {
    console.log('[app]', message);
  }
}

/** Keeps messages in memory so the page can show them. */
@Injectable()
export class MemoryLogger extends Logger {
  readonly messages = signal<string[]>([]);

  log(message: string): void {
    this.messages.update((m) => [...m, `${new Date().toLocaleTimeString()} – ${message}`]);
  }
}

import { Injectable, InjectionToken, signal } from '@angular/core';

/** What the app depends on. Nothing provides it yet – that's your job in app.config.ts. */
export abstract class Logger {
  abstract log(message: string): void;
}

/** Keeps messages in memory so the page can show them. */
@Injectable()
export class MemoryLogger extends Logger {
  readonly messages = signal<string[]>([]);

  log(message: string): void {
    this.messages.update((m) => [...m, message]);
  }
}

/** The shop's name – a plain string, so it needs a token. */
export const APP_NAME = new InjectionToken<string>('APP_NAME');

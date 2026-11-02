import { ApplicationConfig } from '@angular/core';
import { Logger, MemoryLogger } from './logger';
import { APP_SETTINGS } from './tokens';

export const appConfig: ApplicationConfig = {
  providers: [
    // Whoever asks for Logger gets the MemoryLogger (the same instance the page reads from).
    // Try it: replace these two lines with { provide: Logger, useClass: ConsoleLogger }
    // (import ConsoleLogger from './logger') and watch the browser console instead.
    MemoryLogger,
    { provide: Logger, useExisting: MemoryLogger },

    // Overrides the factory default of the token.
    { provide: APP_SETTINGS, useValue: { appName: 'Angular Academy Shop', maxItems: 5 } },
  ],
};

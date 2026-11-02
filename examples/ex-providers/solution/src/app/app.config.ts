import { ApplicationConfig } from '@angular/core';
import { APP_NAME, Logger, MemoryLogger } from './logger';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: Logger, useClass: MemoryLogger },
    { provide: APP_NAME, useValue: 'My Shop' },
  ],
};

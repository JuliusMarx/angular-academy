import { ApplicationConfig } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    // TODO 1: whoever injects Logger should get a MemoryLogger (useClass)
    // TODO 2: provide the APP_NAME token with the value "My Shop" (useValue)
  ],
};

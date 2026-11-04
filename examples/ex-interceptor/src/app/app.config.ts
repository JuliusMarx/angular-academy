import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { fakeBackendInterceptor } from './fake-backend';

export const appConfig: ApplicationConfig = {
  providers: [
    // TODO 3: register errorInterceptor and authInterceptor – before fakeBackendInterceptor,
    // which plays the server and must stay last
    provideHttpClient(withInterceptors([fakeBackendInterceptor])),
  ],
};

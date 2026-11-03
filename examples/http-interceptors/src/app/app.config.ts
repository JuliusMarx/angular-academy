import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { authInterceptor, fakeBackendInterceptor, loggingInterceptor } from './interceptors';

export const appConfig: ApplicationConfig = {
  providers: [
    // The order matters: each interceptor passes the request on to the next one.
    provideHttpClient(withFetch(), withInterceptors([loggingInterceptor, authInterceptor, fakeBackendInterceptor])),
  ],
};

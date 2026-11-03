import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { fakeBackendInterceptor } from './fake-backend';
import { authInterceptor, errorInterceptor } from './interceptors';

export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(withFetch(), withInterceptors([errorInterceptor, authInterceptor, fakeBackendInterceptor]))],
};

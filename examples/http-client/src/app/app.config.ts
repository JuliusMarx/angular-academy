import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';

export const appConfig: ApplicationConfig = {
  // Makes HttpClient available everywhere – withFetch() uses the browser's fetch API.
  providers: [provideHttpClient(withFetch())],
};

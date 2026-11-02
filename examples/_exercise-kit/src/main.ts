import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';
import { checks, exercise } from './exercise/checks';
import { reportCrash, runChecks } from './exercise/check-kit';

bootstrapApplication(App, appConfig)
  .then((appRef) => runChecks(exercise, appRef, checks))
  .catch((err) => {
    console.error(err);
    reportCrash(exercise, checks, err);
  });

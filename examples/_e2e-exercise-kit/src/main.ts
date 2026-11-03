// Runs your UI tests, shows the results and checks how good your tests are.
// Inside the test frame, this file starts the app – the real one or a broken version from ./exercise/mutants.ts.
// After every save the preview reloads and runs everything again.
import { Type } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';
import { checks, exercise } from './exercise/checks';
import { reportCrash, runChecks } from './exercise/check-kit';
import * as mutants from './exercise/mutants';
import { appUnderTest, runTests } from './testing/playwright';
import { renderReport } from './testing/report';
import './specs';

const variant = appUnderTest();

if (variant !== undefined) {
  const root = variant ? (mutants as Record<string, Type<unknown>>)[variant] : App;
  bootstrapApplication(root, appConfig).catch((err) => console.error(err));
} else {
  (async () => {
    try {
      renderReport(await runTests(), document.querySelector('app-root') ?? document.body);
      await runChecks(exercise, checks);
    } catch (err) {
      console.error(err);
      reportCrash(exercise, checks, err);
    }
  })();
}

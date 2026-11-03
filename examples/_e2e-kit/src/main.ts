// Runs the UI tests in e2e/ – in a real project you would start them with `npx playwright test`.
// The tests drive the app in a frame below the results. Inside that frame, this file starts the app.
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';
import { appUnderTest, runTests } from './testing/playwright';
import { renderReport } from './testing/report';
import './specs';

if (appUnderTest() !== undefined) {
  bootstrapApplication(App, appConfig).catch((err) => console.error(err));
} else {
  runTests()
    .then((run) => renderReport(run, document.querySelector('app-root') ?? document.body))
    .catch((err) => console.error(err));
}

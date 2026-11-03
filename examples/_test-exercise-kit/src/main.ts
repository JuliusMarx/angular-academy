// Runs your specs, shows the results and checks how good your tests are.
// After every save the preview reloads and runs everything again.
import './testing/setup';
import './specs';
import { checks, exercise } from './exercise/checks';
import { reportCrash, runChecks } from './exercise/check-kit';
import { runTests } from './testing/mini-test';
import { renderReport } from './testing/report';

(async () => {
  try {
    renderReport(await runTests(), document.querySelector('app-root') ?? document.body);
    await runChecks(exercise, checks);
  } catch (err) {
    console.error(err);
    reportCrash(exercise, checks, err);
  }
})();

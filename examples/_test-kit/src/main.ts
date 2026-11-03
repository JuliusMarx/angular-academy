// Runs the specs instead of the app – in a real project you would start them with `ng test`.
import './testing/setup';
import './specs';
import { renderReport } from './testing/report';
import { runTests } from './testing/mini-test';

runTests()
  .then((run) => renderReport(run, document.querySelector('app-root') ?? document.body))
  .catch((err) => console.error(err));

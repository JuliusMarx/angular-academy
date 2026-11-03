import { Check } from './check-kit';
import { Weather } from '../app/weather';
import { ErrorMutant, ParamMutant, RoundingMutant } from './mutants';

export const exercise = 'ex-test-http';

export const checks: Check[] = [
  {
    id: 'tests-pass',
    run: async (t) => {
      const run = await t.runTests();
      t.expect(run.failed === 0, `${run.failed} of your tests fail against the real Weather service`);
      t.expect(run.passed >= 3, `Write at least 3 tests (there are ${run.passed})`);
    },
  },
  {
    id: 'catches-param-bug',
    run: (t) => t.expectCaught([[Weather, ParamMutant]], 'No test fails when the city is sent as ?q= instead of ?city='),
  },
  {
    id: 'catches-rounding-bug',
    run: (t) => t.expectCaught([[Weather, RoundingMutant]], 'No test fails when 11.6 becomes "11 °C" instead of "12 °C"'),
  },
  {
    id: 'catches-error-bug',
    run: (t) => t.expectCaught([[Weather, ErrorMutant]], 'No test fails when an error reaches the caller instead of "Unknown city"'),
  },
];

import { Check } from './check-kit';
import { Rating } from '../app/rating';
import { ClickMutant, EmitMutant, InputMutant } from './mutants';

export const exercise = 'ex-test-component';

export const checks: Check[] = [
  {
    id: 'tests-pass',
    run: async (t) => {
      const run = await t.runTests();
      t.expect(run.failed === 0, `${run.failed} of your tests fail against the real Rating component`);
      t.expect(run.passed >= 4, `Write at least 3 more tests (there are ${run.passed})`);
    },
  },
  {
    id: 'catches-input-bug',
    run: (t) => t.expectCaught([[Rating, InputMutant]], 'No test fails when the component ignores the value input'),
  },
  {
    id: 'catches-click-bug',
    run: (t) => t.expectCaught([[Rating, ClickMutant]], 'No test fails when a click does not update the label'),
  },
  {
    id: 'catches-emit-bug',
    run: (t) => t.expectCaught([[Rating, EmitMutant]], 'No test fails when rated is never emitted'),
  },
];

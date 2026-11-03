import { Check } from './check-kit';

export const exercise = 'ex-test-e2e';

export const checks: Check[] = [
  {
    id: 'tests-pass',
    run: async (t) => {
      const run = await t.runTests();
      t.expect(run.failed === 0, `${run.failed} of your tests fail against the real app`);
      t.expect(run.passed >= 3, `Write at least 2 more tests (there are ${run.passed})`);
    },
  },
  {
    id: 'catches-validation-bug',
    run: (t) => t.expectCaught('ValidationMutant', 'No test fails when the app accepts an invalid address'),
  },
  {
    id: 'catches-confirmation-bug',
    run: (t) => t.expectCaught('ConfirmationMutant', 'No test fails when a valid address is never confirmed'),
  },
  {
    id: 'catches-address-bug',
    run: (t) => t.expectCaught('AddressMutant', 'No test fails when the confirmation shows the wrong address'),
  },
];

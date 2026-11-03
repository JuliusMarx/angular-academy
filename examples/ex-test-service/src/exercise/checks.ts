import { Check } from './check-kit';
import { TodoList } from '../app/todo-list';
import { AddMutant, ClearMutant, ToggleMutant } from './mutants';

export const exercise = 'ex-test-service';

export const checks: Check[] = [
  {
    id: 'tests-pass',
    run: async (t) => {
      const run = await t.runTests();
      t.expect(run.failed === 0, `${run.failed} of your tests fail against the real TodoList`);
      t.expect(run.passed >= 4, `Write at least 3 more tests (there are ${run.passed})`);
    },
  },
  {
    id: 'catches-add-bug',
    run: (t) => t.expectCaught([[TodoList, AddMutant]], 'No test fails when add() creates todos that are already done'),
  },
  {
    id: 'catches-toggle-bug',
    run: (t) => t.expectCaught([[TodoList, ToggleMutant]], 'No test fails when toggle() does nothing'),
  },
  {
    id: 'catches-clear-bug',
    run: (t) => t.expectCaught([[TodoList, ClearMutant]], 'No test fails when clearCompleted() removes all todos'),
  },
];

import { Check } from './check-kit';

export const exercise = 'ex-control-flow';

const items = (t: Parameters<Check['run']>[0]) => t.$$('#tasks li:not(.empty)');

export const checks: Check[] = [
  {
    id: 'renders-list',
    run: (t) => {
      t.expect(items(t).length === 3, `Expected 3 list items, found ${items(t).length}`);
      t.expect(items(t)[1].textContent?.includes('Learn @for'), 'The items should show the task titles');
    },
  },
  {
    id: 'add-works',
    run: async (t) => {
      await t.click(t.button('Add'));
      t.expect(items(t).length === 4, `Expected 4 items after "Add", found ${items(t).length}`);
    },
  },
  {
    id: 'empty-state',
    run: async (t) => {
      await t.click(t.button('Clear'));
      t.expect(items(t).length === 0, 'The list should be empty after "Clear"');
      t.expectText('#tasks .empty', 'No tasks');
    },
  },
];

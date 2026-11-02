import { Check } from './check-kit';

export const exercise = 'ex-outputs';

export const checks: Check[] = [
  {
    id: 'parent-updates',
    run: async (t) => {
      await t.click(t.button('Like'));
      t.expectText('#total', 'has 1 likes');
    },
  },
  {
    id: 'sends-count',
    run: async (t) => {
      await t.click(t.button('Like'));
      await t.click(t.button('Like'));
      t.expectText('#total', 'has 3 likes');
    },
  },
];

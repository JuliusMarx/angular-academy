import { Check } from './check-kit';

export const exercise = 'ex-signals-counter';

export const checks: Check[] = [
  {
    id: 'squared-shown',
    run: (t) => t.expectText('#squared', '0'),
  },
  {
    id: 'squared-updates',
    run: async (t) => {
      const plus = t.button('+');
      await t.click(plus);
      await t.click(plus);
      await t.click(plus);
      t.expectText('#count', '3');
      t.expectText('#squared', '9');
    },
  },
  {
    id: 'reset',
    run: async (t) => {
      await t.click(t.button('+'));
      await t.click(t.button('Reset'));
      t.expectText('#count', '0');
      t.expectText('#squared', '0');
    },
  },
];

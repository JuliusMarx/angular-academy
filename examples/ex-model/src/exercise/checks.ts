import { Check } from './check-kit';

export const exercise = 'ex-model';

export const checks: Check[] = [
  {
    id: 'child-changes',
    run: async (t) => {
      await t.click(t.button('+'));
      t.expectText('#child-value', '3');
    },
  },
  {
    id: 'parent-sees-change',
    run: async (t) => {
      await t.click(t.button('+'));
      t.expectText('#child-value', '4');
      t.expectText('#parent-value', '4');
    },
  },
  {
    id: 'parent-sets-value',
    run: async (t) => {
      await t.click(t.button('Set to 5'));
      t.expectText('#child-value', '5');
      await t.click(t.button('−'));
      t.expectText('#parent-value', '4');
    },
  },
];

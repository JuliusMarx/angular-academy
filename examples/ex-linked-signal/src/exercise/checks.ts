import { Check } from './check-kit';

export const exercise = 'ex-linked-signal';

export const checks: Check[] = [
  {
    id: 'can-select',
    run: async (t) => {
      await t.click(t.button('Banana'));
      t.expectText('#selected', 'Banana');
    },
  },
  {
    id: 'resets-on-category',
    run: async (t) => {
      await t.click(t.button('Banana'));
      await t.click(t.button('Vegetables'));
      t.expectText('#selected', 'Carrot');
    },
  },
  {
    id: 'select-after-reset',
    run: async (t) => {
      await t.click(t.button('Leek'));
      t.expectText('#selected', 'Leek');
    },
  },
];

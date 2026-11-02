import { Check } from './check-kit';

export const exercise = 'ex-template-variables';

export const checks: Check[] = [
  {
    id: 'count-shown',
    run: (t) => t.expectText('#count', /\b2 items\b/),
  },
  {
    id: 'adds-item',
    run: async (t) => {
      await t.type('#item', 'Apples');
      await t.click(t.button('Add'));
      const items = t.$$('#list li').map((li) => li.textContent?.trim());
      t.expect(items.includes('Apples'), `"Apples" is not in the list: ${items.join(', ')}`);
      t.expectText('#count', /\b3 items\b/);
    },
  },
  {
    id: 'clears-input',
    run: async (t) => {
      await t.type('#item', 'Butter');
      await t.click(t.button('Add'));
      const input = t.$('#item') as HTMLInputElement;
      t.expect(input.value === '', `The input still contains "${input.value}"`);
    },
  },
];

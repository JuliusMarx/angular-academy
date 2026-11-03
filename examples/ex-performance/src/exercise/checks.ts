import { Check } from './check-kit';
import { stats } from '../app/products';

export const exercise = 'ex-performance';

export const checks: Check[] = [
  {
    id: 'filter-works',
    run: async (t) => {
      await t.type('#filter', 'mo');
      t.expect(t.$$('li').length === 2, `"mo" should show Mouse and Monitor, but shows ${t.$$('li').length} products`);
      await t.type('#filter', '');
    },
  },
  {
    id: 'no-needless-filtering',
    run: async (t) => {
      const before = stats.filterRuns;
      for (let i = 0; i < 5; i++) await t.click(t.button('❤'));
      const extra = stats.filterRuns - before;
      t.expect(extra === 0, `Clicking ❤ 5 times ran the filter ${extra} more times – it should not run at all`);
    },
  },
  {
    id: 'track-by-id',
    run: async (t) => {
      const keyboard = t.$$('li').find((li) => li.textContent?.includes('Keyboard'));
      t.expect(keyboard, 'Keyboard should be in the list');
      await t.click(t.button('Add product at the top'));
      const after = t.$$('li').find((li) => li.textContent?.includes('Keyboard'));
      t.expect(after === keyboard, 'Adding at the top recreated the Keyboard element – track by the id, not the position');
    },
  },
];

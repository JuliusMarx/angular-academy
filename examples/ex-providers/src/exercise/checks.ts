import { Check } from './check-kit';

export const exercise = 'ex-providers';

export const checks: Check[] = [
  {
    id: 'app-starts',
    run: (t) => t.expect(t.$$('h1').length === 1, 'The app did not render'),
  },
  {
    id: 'app-name',
    run: (t) => t.expectText('h1', /^My Shop$/),
  },
  {
    id: 'memory-logger',
    run: async (t) => {
      await t.click(t.button('Save'));
      const entries = t.$$('#log li').map((li) => li.textContent?.trim());
      t.expect(entries.includes('Saved'), 'No "Saved" entry in the log – is Logger provided as MemoryLogger?');
    },
  },
];

import { Check } from './check-kit';

export const exercise = 'ex-interop';

export const checks: Check[] = [
  {
    id: 'latest-message',
    run: async (t) => {
      await t.click(t.button('Build passed'));
      t.expectText('#latest', 'Build passed');
    },
  },
  {
    id: 'message-history',
    run: async (t) => {
      await t.click(t.button('Deploy failed'));
      await t.click(t.button('Build failed'));
      t.expectText('#count', '3 messages');
      t.expect(t.$$('#matching li').length === 3, 'The list should show all 3 messages');
    },
  },
  {
    id: 'debounced-filter',
    run: async (t) => {
      await t.type('#keyword', 'build');
      t.expect(t.$$('#matching li').length === 3, 'The filter should wait for a typing pause before it applies');
      await t.eventually(() => t.expect(t.$$('#matching li').length === 2, `Expected 2 messages with "build", found ${t.$$('#matching li').length}`), 1500);
    },
  },
];

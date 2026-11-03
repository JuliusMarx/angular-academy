import { Check } from './check-kit';

export const exercise = 'ex-interceptor';

export const checks: Check[] = [
  {
    id: 'adds-token',
    run: async (t) => {
      await t.click(t.button('Load profile'));
      await t.eventually(() => t.expectText('#profile', 'Signed in as Ada Lovelace'));
    },
  },
  {
    id: 'token-only-for-api',
    run: async (t) => {
      await t.click(t.button('Send analytics'));
      await t.eventually(() => t.expectText('#analytics', 'Analytics sent'));
    },
  },
  {
    id: 'error-banner',
    run: async (t) => {
      await t.click(t.button('Load missing file'));
      await t.eventually(() => t.expectText('#banner', 'Request failed: 404'));
    },
  },
];

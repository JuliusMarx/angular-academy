import { Check } from './check-kit';

export const exercise = 'ex-resource';

export const checks: Check[] = [
  {
    id: 'shows-loading',
    run: async (t) => {
      await t.click(t.button('User 2'), { untilStable: false });
      t.expect(t.$$('#loading').length === 1, 'No <p id="loading"> while the user is loading');
    },
  },
  {
    id: 'shows-user',
    run: async (t) => {
      await t.eventually(() => t.expectText('#name', 'Alan Turing'));
      await t.click(t.button('User 1'));
      await t.eventually(() => t.expectText('#name', 'Ada Lovelace'));
    },
  },
  {
    id: 'shows-error',
    run: async (t) => {
      await t.click(t.button('User 99'));
      await t.eventually(() => t.expectText('#error', 'User 99 not found'));
      t.expect(t.$$('#name').length === 0, 'The name should not be shown when loading failed');
    },
  },
];

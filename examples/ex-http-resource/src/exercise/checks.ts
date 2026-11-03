import { Check } from './check-kit';

export const exercise = 'ex-http-resource';

export const checks: Check[] = [
  {
    id: 'shows-user',
    run: async (t) => {
      await t.eventually(() => t.expectText('#user', 'Ada Lovelace from London'));
    },
  },
  {
    id: 'follows-id',
    run: async (t) => {
      await t.click(t.button('Next'));
      await t.eventually(() => t.expectText('#user', 'Grace Hopper from New York'));
    },
  },
  {
    id: 'shows-error',
    run: async (t) => {
      await t.click(t.button('Next')); // user 3 doesn't exist
      await t.eventually(() => t.expectText('#user', 'User could not be loaded.'));
      await t.click(t.button('Previous'));
      await t.eventually(() => t.expectText('#user', 'Grace Hopper'));
    },
  },
];

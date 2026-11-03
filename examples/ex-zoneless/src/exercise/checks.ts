import { Check } from './check-kit';

export const exercise = 'ex-zoneless';

export const checks: Check[] = [
  {
    id: 'countdown-updates',
    run: async (t) => {
      // No clicks here – the page has to update by itself.
      await t.eventually(() => t.expect(Number(t.text('#countdown')) < 10, 'The countdown should go down by itself'), 1500);
    },
  },
  {
    id: 'liftoff',
    run: async (t) => {
      await t.eventually(() => t.expectText('#liftoff', 'Liftoff'), 2500);
    },
  },
  {
    id: 'weather-updates',
    run: async (t) => {
      await t.click(t.button('Check the weather'));
      await t.eventually(() => t.expectText('#weather', 'Clear skies'), 1500);
    },
  },
];

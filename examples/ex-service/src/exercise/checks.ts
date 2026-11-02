import { Check } from './check-kit';

export const exercise = 'ex-service';

export const checks: Check[] = [
  {
    id: 'adds-favorite',
    run: async (t) => {
      await t.click(t.button('♥ Mug'));
      t.expectText('#fav-count', /^1$/);
    },
  },
  {
    id: 'counts-several',
    run: async (t) => {
      await t.click(t.button('♥ T-Shirt'));
      t.expectText('#fav-count', /^2$/);
    },
  },
  {
    id: 'toggles-off',
    run: async (t) => {
      const mug = t.button('♥ Mug');
      await t.click(mug);
      t.expectText('#fav-count', /^1$/);
      t.expect(mug.getAttribute('aria-pressed') === 'false', 'The Mug button should have aria-pressed="false" again');
      t.expect(t.button('♥ T-Shirt').getAttribute('aria-pressed') === 'true', 'The T-Shirt button should have aria-pressed="true"');
    },
  },
];

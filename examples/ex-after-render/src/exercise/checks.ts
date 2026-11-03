import { Check } from './check-kit';

export const exercise = 'ex-after-render';

const shown = (t: Parameters<Check['run']>[0]) => Number(t.text('#height'));
const actual = (t: Parameters<Check['run']>[0]) => t.$('.banner').offsetHeight;

export const checks: Check[] = [
  {
    id: 'measures-after-render',
    run: async (t) => {
      await t.eventually(() =>
        t.expect(shown(t) > 0 && shown(t) === actual(t), `Shows ${shown(t)} px, but the banner is ${actual(t)} px high`),
      );
    },
  },
  {
    id: 'measures-again',
    run: async (t) => {
      await t.click(t.button('Toggle size'));
      await t.eventually(() =>
        t.expect(shown(t) === actual(t), `After "Toggle size" it shows ${shown(t)} px, but the banner is ${actual(t)} px high`),
      );
      await t.click(t.button('Toggle size'));
      await t.eventually(() => t.expect(shown(t) === actual(t), `After toggling back it shows ${shown(t)} px instead of ${actual(t)} px`));
    },
  },
];

import { Check, TestKit } from './check-kit';

export const exercise = 'ex-stopwatch';

const ticks = (t: TestKit) => Number(t.text('#ticks'));

export const checks: Check[] = [
  {
    id: 'counts-up',
    run: async (t) => {
      await t.click(t.button('Start'));
      await t.eventually(() => t.expect(ticks(t) >= 3, `Expected the ticks to count up, but they show ${ticks(t)}`));
    },
  },
  {
    id: 'stops',
    run: async (t) => {
      await t.click(t.button('Stop'));
      const stoppedAt = ticks(t);
      await t.settle(400);
      t.expect(ticks(t) === stoppedAt, `After Stop the ticks went on from ${stoppedAt} to ${ticks(t)}`);
    },
  },
  {
    id: 'single-interval',
    run: async (t) => {
      const before = ticks(t);
      await t.click(t.button('Start'));
      await t.click(t.button('Start'));
      await t.settle(1000);
      await t.click(t.button('Stop'));
      const counted = ticks(t) - before;
      t.expect(counted > 0, 'Start should start the stopwatch again');
      t.expect(counted <= 13, `About 10 ticks per second expected, but ${counted} were counted – is a second interval running?`);
    },
  },
];

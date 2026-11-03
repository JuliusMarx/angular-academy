import { Check, TestKit } from './check-kit';

export const exercise = 'ex-search-pipeline';

const requests = (t: TestKit) => Number(t.text('#requests'));

export const checks: Check[] = [
  {
    id: 'finds-country',
    run: async (t) => {
      await t.type('#search', 'germ');
      await t.eventually(() => t.expectText('ul', 'Germany'));
    },
  },
  {
    id: 'ignores-short',
    run: async (t) => {
      await t.settle(400);
      const before = requests(t);
      await t.type('#search', 'g');
      await t.settle(500);
      t.expect(requests(t) === before, 'A single letter should not send a request');
    },
  },
  {
    id: 'debounces',
    run: async (t) => {
      const before = requests(t);
      await t.type('#search', 'sp');
      await t.type('#search', 'spa');
      await t.type('#search', 'spai');
      await t.settle(600);
      const sent = requests(t) - before;
      t.expect(sent === 1, `Typing "spai" quickly should send 1 request, but sent ${sent}`);
      await t.eventually(() => t.expectText('ul', 'Spain'));
    },
  },
  {
    id: 'no-duplicates',
    run: async (t) => {
      await t.type('#search', 'spain');
      await t.settle(600);
      const before = requests(t);
      await t.type('#search', ' spain ');
      await t.settle(600);
      t.expect(requests(t) === before, '" spain " is the same query as "spain" and should not be sent again');
    },
  },
];

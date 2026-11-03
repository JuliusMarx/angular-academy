import { Check } from './check-kit';

export const exercise = 'ex-http-client';

export const checks: Check[] = [
  {
    id: 'loads-todos',
    run: async (t) => {
      await t.eventually(() => t.expect(t.$$('li').length === 3, `Expected 3 todos, but there are ${t.$$('li').length}`));
    },
  },
  {
    id: 'shows-titles',
    run: async (t) => {
      await t.eventually(() => t.expectText('li', 'Buy milk'));
    },
  },
  {
    id: 'open-count',
    run: async (t) => {
      await t.eventually(() => t.expectText('#open-count', '2 open'));
    },
  },
];

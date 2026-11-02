import { Check } from './check-kit';

export const exercise = 'ex-projection';

const alerts = (t: Parameters<Check['run']>[0]) => t.$$('app-alert .alert');

export const checks: Check[] = [
  {
    id: 'title-slot',
    run: (t) => {
      const title = alerts(t)[0]?.querySelector('.title')?.textContent?.trim();
      t.expect(title === 'Heads up!', `The first alert's title area shows "${title ?? ''}"`);
    },
  },
  {
    id: 'body-slot',
    run: (t) => {
      const body = alerts(t)[0]?.querySelector('.body')?.textContent?.trim() ?? '';
      t.expect(body.includes('saved automatically'), `The first alert's body area shows "${body}"`);
      t.expect(!body.includes('Heads up'), 'The title should not also appear in the body');
    },
  },
  {
    id: 'fallback-title',
    run: (t) => {
      const title = alerts(t)[1]?.querySelector('.title')?.textContent?.trim();
      t.expect(title === 'Note', `The second alert's title area shows "${title ?? ''}" instead of "Note"`);
    },
  },
];

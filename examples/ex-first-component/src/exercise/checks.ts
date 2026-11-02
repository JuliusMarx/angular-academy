import { Check } from './check-kit';

export const exercise = 'ex-first-component';

export const checks: Check[] = [
  {
    id: 'component-exists',
    run: (t) => t.expect(t.$$('app-user-badge').length > 0, 'No <app-user-badge> element on the page'),
  },
  {
    id: 'used-twice',
    run: (t) => t.expect(t.$$('app-user-badge').length === 2, `Expected 2 badges, found ${t.$$('app-user-badge').length}`),
  },
  {
    id: 'shows-text',
    run: (t) => {
      const badges = t.$$('app-user-badge .badge');
      t.expect(badges.length === 2, 'Each badge needs a <span class="badge">');
      t.expect(badges.every((b) => b.textContent?.includes('Angular Fan')), 'The badge should say "Angular Fan"');
    },
  },
];

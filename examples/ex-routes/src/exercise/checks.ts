import { Check, TestKit } from './check-kit';

export const exercise = 'ex-routes';

const link = (t: TestKit, label: string) => {
  const a = t.$$('nav a').find((el) => el.textContent?.trim() === label);
  t.expect(a, `No "${label}" link in the navigation`);
  return a!;
};

export const checks: Check[] = [
  {
    id: 'home-route',
    run: async (t) => {
      await t.navigate('/');
      t.expectText('h1', /^Home$/);
    },
  },
  {
    id: 'menu-link',
    run: async (t) => {
      await t.click(link(t, 'Menu'));
      t.expect(t.url() === '/menu', `The URL is ${t.url()} instead of /menu`);
      t.expectText('h1', /^Menu$/);
    },
  },
  {
    id: 'active-link',
    run: async (t) => {
      await t.navigate('/menu');
      t.expect(link(t, 'Menu').classList.contains('active'), 'The Menu link should have the class "active" on /menu');
      t.expect(!link(t, 'Home').classList.contains('active'), 'The Home link should not be "active" on /menu');
    },
  },
  {
    id: 'redirect',
    run: async (t) => {
      await t.navigate('/food');
      t.expect(t.url() === '/menu', `/food leads to ${t.url()} instead of /menu`);
    },
  },
  {
    id: 'not-found',
    run: async (t) => {
      await t.navigate('/this-does-not-exist');
      t.expectText('h1', /^Page not found$/);
    },
  },
];

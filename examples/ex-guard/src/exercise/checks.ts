import { Check } from './check-kit';

export const exercise = 'ex-guard';

export const checks: Check[] = [
  {
    id: 'redirects-when-logged-out',
    run: async (t) => {
      await t.navigate('/admin');
      t.expect(t.url().startsWith('/login'), `Logged out, /admin leads to ${t.url()} instead of /login`);
      t.expect(!t.text('h1').includes('Admin'), 'The admin page must not be visible while logged out');
    },
  },
  {
    id: 'admin-after-login',
    run: async (t) => {
      await t.navigate('/login');
      await t.click(t.button('Log in'));
      await t.navigate('/admin');
      t.expect(t.url() === '/admin', `Logged in, /admin leads to ${t.url()}`);
      t.expectText('h1', /^Admin$/);
    },
  },
  {
    id: 'other-pages-open',
    run: async (t) => {
      await t.navigate('/');
      t.expectText('h1', /^Home$/);
    },
  },
];

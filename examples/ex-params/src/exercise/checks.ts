import { Check } from './check-kit';

export const exercise = 'ex-params';

export const checks: Check[] = [
  {
    id: 'list-links',
    run: async (t) => {
      await t.navigate('/books');
      const dune = t.$$('li a').find((a) => a.textContent?.trim() === 'Dune');
      t.expect(dune, 'No "Dune" link in the list');
      await t.click(dune!);
      t.expect(t.url() === '/books/2', `Clicking "Dune" leads to ${t.url()} instead of /books/2`);
    },
  },
  {
    id: 'detail-from-param',
    run: async (t) => {
      await t.navigate('/books/3');
      t.expectText('h1', /^Neuromancer$/);
    },
  },
  {
    id: 'unknown-id',
    run: async (t) => {
      await t.navigate('/books/99');
      t.expectText('h1', /^Book not found$/);
    },
  },
];

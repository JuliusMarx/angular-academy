import { Check } from './check-kit';

export const exercise = 'ex-inputs';

const tags = (t: Parameters<Check['run']>[0]) => t.$$('app-price-tag .price-tag').map((el) => el.textContent?.trim() ?? '');

export const checks: Check[] = [
  {
    id: 'shows-amount',
    run: (t) => t.expect(tags(t)[0]?.startsWith('12.50'), `The first tag shows "${tags(t)[0]}"`),
  },
  {
    id: 'default-currency',
    run: (t) => t.expect(tags(t)[0] === '12.50 EUR', `The first tag shows "${tags(t)[0]}" instead of "12.50 EUR"`),
  },
  {
    id: 'custom-currency',
    run: (t) => t.expect(tags(t)[1] === '4.90 USD', `The second tag shows "${tags(t)[1]}" instead of "4.90 USD"`),
  },
];

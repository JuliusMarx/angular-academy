import { Check } from './check-kit';

export const exercise = 'ex-architecture';

export const checks: Check[] = [
  {
    id: 'product-cards',
    run: (t) => {
      const cards = t.$$('app-product-card');
      t.expect(cards.length === 3, `Expected 3 <app-product-card> elements, found ${cards.length}`);
      t.expect(cards[1].textContent?.includes('Mouse'), 'The second card should show the Mouse');
    },
  },
  {
    id: 'card-adds-to-cart',
    run: async (t) => {
      const button = t.$$('app-product-card')[1]?.querySelector('button');
      t.expect(button, 'The second card has no button');
      await t.click(button!);
      t.expectText('app-cart-badge', '1 item');
    },
  },
  {
    id: 'badge-total',
    run: async (t) => {
      const button = t.$$('app-product-card')[2]?.querySelector('button');
      t.expect(button, 'The third card has no button');
      await t.click(button!);
      t.expectText('app-cart-badge', '2 items');
      t.expectText('app-cart-badge', '€284.00');
    },
  },
];

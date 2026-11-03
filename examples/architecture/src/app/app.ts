import { Component } from '@angular/core';
import { CartBadge } from './cart/cart-badge';
import { ProductList } from './products/product-list';

/**
 * Folders by feature:
 *   products/  product.ts, product-card.ts (presentational), product-list.ts (container)
 *   cart/      cart-store.ts (state), cart-badge.ts
 */
@Component({
  selector: 'app-root',
  imports: [CartBadge, ProductList],
  template: `
    <header>
      <h1>Shop</h1>
      <app-cart-badge />
    </header>
    <app-product-list />
  `,
  styles: `
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  `,
})
export class App {}

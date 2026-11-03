import { Component, inject } from '@angular/core';
import { CartBadge } from './cart-badge';
import { CartStore } from './cart-store';
import { Product } from './product';
import { ProductCard } from './product-card';

@Component({
  selector: 'app-root',
  imports: [CartBadge, ProductCard],
  template: `
    <header>
      <h1>Shop</h1>
      <app-cart-badge />
    </header>

    @for (product of products; track product.id) {
      <app-product-card [product]="product" (add)="cart.add(product)" />
    }
  `,
})
export class App {
  protected readonly cart = inject(CartStore);
  protected readonly products: Product[] = [
    { id: 1, name: 'Keyboard', price: 89 },
    { id: 2, name: 'Mouse', price: 35 },
    { id: 3, name: 'Monitor', price: 249 },
  ];
}

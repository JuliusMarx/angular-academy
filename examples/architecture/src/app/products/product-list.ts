import { Component, inject } from '@angular/core';
import { CartStore } from '../cart/cart-store';
import { Product } from './product';
import { ProductCard } from './product-card';

/** Container: knows where the data comes from and what happens on an action. */
@Component({
  selector: 'app-product-list',
  imports: [ProductCard],
  template: `
    <div class="grid">
      @for (product of products; track product.id) {
        <app-product-card [product]="product" (add)="cart.add(product)" />
      }
    </div>
  `,
  styles: `
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
      gap: 1rem;
    }
  `,
})
export class ProductList {
  protected readonly cart = inject(CartStore);
  protected readonly products: Product[] = [
    { id: 1, name: 'Keyboard', price: 89 },
    { id: 2, name: 'Mouse', price: 35 },
    { id: 3, name: 'Monitor', price: 249 },
  ];
}

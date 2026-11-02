import { Component, inject } from '@angular/core';
import { CartService, Product } from './cart.service';

@Component({
  selector: 'app-product-list',
  template: `
    <h2>Products</h2>
    @for (p of products; track p.id) {
      <p>
        {{ p.name }} – {{ p.price }} €
        <button type="button" (click)="cart.add(p)">Add to cart</button>
      </p>
    }
  `,
})
export class ProductList {
  protected readonly cart = inject(CartService);
  protected readonly products: Product[] = [
    { id: 1, name: 'Mug', price: 12 },
    { id: 2, name: 'T-Shirt', price: 25 },
    { id: 3, name: 'Sticker', price: 3 },
  ];
}

import { Component } from '@angular/core';
import { CartSummary } from './cart-summary';
import { ProductList } from './product-list';

@Component({
  selector: 'app-root',
  imports: [CartSummary, ProductList],
  template: `
    <h1>Shop</h1>
    <!-- The two components know nothing about each other – they share the CartService. -->
    <div class="columns">
      <app-product-list />
      <app-cart-summary />
    </div>
  `,
  styles: `
    .columns {
      display: flex;
      gap: 2rem;
      flex-wrap: wrap;
    }
  `,
})
export class App {}

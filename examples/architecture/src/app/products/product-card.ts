import { CurrencyPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { Product } from './product';

/**
 * Presentational: knows nothing about the cart or where products come from.
 * Data comes in through input(), actions go out through output().
 */
@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe],
  template: `
    <h3>{{ product().name }}</h3>
    <p>{{ product().price | currency: 'EUR' }}</p>
    <button type="button" (click)="add.emit()">Add to cart</button>
  `,
  styles: `
    :host {
      display: block;
      padding: 0.75rem;
      border: 1px solid #d0d7de;
      border-radius: 8px;
    }
  `,
})
export class ProductCard {
  readonly product = input.required<Product>();
  readonly add = output();
}

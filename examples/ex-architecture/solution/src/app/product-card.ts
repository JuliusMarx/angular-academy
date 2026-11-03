import { CurrencyPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { Product } from './product';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe],
  template: `
    <h3>{{ product().name }}</h3>
    <p>{{ product().price | currency: 'EUR' }}</p>
    <button type="button" (click)="add.emit()">Add to cart</button>
  `,
})
export class ProductCard {
  readonly product = input.required<Product>();
  readonly add = output();
}

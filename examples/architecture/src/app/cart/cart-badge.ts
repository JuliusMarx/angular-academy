import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CartStore } from './cart-store';

@Component({
  selector: 'app-cart-badge',
  imports: [CurrencyPipe],
  template: `🛒 {{ cart.count() }} {{ cart.count() === 1 ? 'item' : 'items' }} · {{ cart.total() | currency: 'EUR' }}`,
})
export class CartBadge {
  protected readonly cart = inject(CartStore);
}

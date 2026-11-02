import { Component, inject } from '@angular/core';
import { CartService } from './cart.service';

@Component({
  selector: 'app-cart-summary',
  template: `
    <h2>Cart ({{ cart.count() }})</h2>
    <ul>
      @for (p of cart.products(); track $index; let i = $index) {
        <li>
          {{ p.name }}
          <button type="button" (click)="cart.remove(i)">Remove</button>
        </li>
      } @empty {
        <li>Your cart is empty.</li>
      }
    </ul>
    <p><strong>Total: {{ cart.total() }} €</strong></p>
  `,
})
export class CartSummary {
  protected readonly cart = inject(CartService);
}

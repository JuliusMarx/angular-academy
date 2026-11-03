import { CurrencyPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { Product } from './product';

/**
 * Everything in one component – it works, but it's hard to reuse and grows with every feature.
 * TODO 4: use <app-cart-badge /> in the header and <app-product-card> in the @for,
 *         and remove the cart state from here.
 */
@Component({
  selector: 'app-root',
  imports: [CurrencyPipe],
  template: `
    <header>
      <h1>Shop</h1>
      <p class="cart">🛒 {{ count() }} {{ count() === 1 ? 'item' : 'items' }} · {{ total() | currency: 'EUR' }}</p>
    </header>

    @for (product of products; track product.id) {
      <div class="card">
        <h3>{{ product.name }}</h3>
        <p>{{ product.price | currency: 'EUR' }}</p>
        <button type="button" (click)="add(product)">Add to cart</button>
      </div>
    }
  `,
})
export class App {
  protected readonly products: Product[] = [
    { id: 1, name: 'Keyboard', price: 89 },
    { id: 2, name: 'Mouse', price: 35 },
    { id: 3, name: 'Monitor', price: 249 },
  ];

  private readonly items = signal<Product[]>([]);
  protected readonly count = computed(() => this.items().length);
  protected readonly total = computed(() => this.items().reduce((sum, p) => sum + p.price, 0));

  protected add(product: Product): void {
    this.items.update((items) => [...items, product]);
  }
}

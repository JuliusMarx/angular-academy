import { computed, Injectable, signal } from '@angular/core';
import { Product } from '../products/product';

/** The cart's state lives here – in one place, for every component that needs it. */
@Injectable({ providedIn: 'root' })
export class CartStore {
  private readonly items = signal<Product[]>([]);

  readonly count = computed(() => this.items().length);
  readonly total = computed(() => this.items().reduce((sum, p) => sum + p.price, 0));

  add(product: Product): void {
    this.items.update((items) => [...items, product]);
  }
}

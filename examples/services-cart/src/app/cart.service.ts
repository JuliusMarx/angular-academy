import { computed, Injectable, signal } from '@angular/core';

export interface Product {
  id: number;
  name: string;
  price: number;
}

/**
 * One instance for the whole app (providedIn: 'root') – every component that injects it
 * sees the same cart. In Angular 22+ you can write @Service() instead.
 */
@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly items = signal<Product[]>([]);

  /** Read-only from the outside – only the service's methods change the cart. */
  readonly products = this.items.asReadonly();
  readonly count = computed(() => this.items().length);
  readonly total = computed(() => this.items().reduce((sum, p) => sum + p.price, 0));

  add(product: Product): void {
    this.items.update((items) => [...items, product]);
  }

  remove(index: number): void {
    this.items.update((items) => items.filter((_, i) => i !== index));
  }
}

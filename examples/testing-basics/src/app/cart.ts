import { computed, inject, Injectable, signal } from '@angular/core';
import { Coupons } from './coupons';

export interface CartItem {
  name: string;
  price: number;
  quantity: number;
}

/** A plain function – the easiest thing to test. */
export function formatPrice(amount: number): string {
  return `€${amount.toFixed(2)}`;
}

@Injectable({ providedIn: 'root' })
export class Cart {
  private readonly coupons = inject(Coupons);
  readonly items = signal<CartItem[]>([]);

  readonly total = computed(() => {
    const sum = this.items().reduce((acc, item) => acc + item.price * item.quantity, 0);
    return sum * (1 - this.coupons.discount());
  });

  add(item: CartItem): void {
    this.items.update((items) => [...items, item]);
  }

  remove(name: string): void {
    this.items.update((items) => items.filter((i) => i.name !== name));
  }
}

import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Coupons {
  /** Discount as a fraction: 0.1 = 10 %. */
  readonly discount = signal(0);

  apply(code: string): void {
    this.discount.set(code === 'ANGULAR10' ? 0.1 : 0);
  }
}

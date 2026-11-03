import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Product, ProductService } from './product.service';

@Component({
  selector: 'app-root',
  imports: [CurrencyPipe],
  template: `
    <h1>Products</h1>

    <!-- Variant 1: toSignal() subscribes for you and turns the response into a signal -->
    @if (products(); as list) {
      <ul>
        @for (p of list; track p.id) {
          <li>{{ p.name }} – {{ p.price | currency: 'EUR' }} {{ p.stock === 0 ? '(sold out)' : '' }}</li>
        }
      </ul>
    } @else {
      <p>Loading …</p>
    }

    <!-- Variant 2: subscribe() yourself, e.g. when the user clicks a button -->
    <button type="button" (click)="countInStock()">How many are in stock?</button>
    @if (inStock() !== null) {
      <p>{{ inStock() }} products are in stock.</p>
    }
  `,
})
export class App {
  private readonly productService = inject(ProductService);

  protected readonly products = toSignal(this.productService.getAll());
  protected readonly inStock = signal<number | null>(null);

  protected countInStock(): void {
    // Nothing is sent until someone subscribes.
    this.productService.getAll().subscribe((list: Product[]) => {
      this.inStock.set(list.filter((p) => p.stock > 0).length);
    });
  }
}

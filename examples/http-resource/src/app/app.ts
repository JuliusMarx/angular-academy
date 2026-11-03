import { CurrencyPipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, signal } from '@angular/core';

interface ProductDetail {
  id: number;
  name: string;
  price: number;
  description: string;
}

@Component({
  selector: 'app-root',
  imports: [CurrencyPipe],
  template: `
    <h1>Product {{ id() }}</h1>

    <button type="button" (click)="id.set(id() - 1)" [disabled]="id() === 1">Previous</button>
    <button type="button" (click)="id.set(id() + 1)">Next</button>
    <button type="button" (click)="product.reload()">Reload</button>

    @if (product.isLoading()) {
      <p>Loading …</p>
    } @else if (product.error()) {
      <p class="error">Product {{ id() }} could not be loaded.</p>
    } @else if (product.hasValue()) {
      <h2>{{ product.value().name }}</h2>
      <p>{{ product.value().description }}</p>
      <p>{{ product.value().price | currency: 'EUR' }}</p>
    }
  `,
  styles: `
    .error {
      color: #b3261e;
    }
  `,
})
export class App {
  protected readonly id = signal(1);

  /** Reads id() – so every change of id sends a new request automatically. */
  protected readonly product = httpResource<ProductDetail>(() => `/api/products/${this.id()}.json`);
}

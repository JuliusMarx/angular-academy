import { Component, computed, inject, input, numberAttribute } from '@angular/core';
import { Router } from '@angular/router';
import { PRODUCTS } from './products';

@Component({
  selector: 'app-product-detail',
  template: `
    @if (product(); as p) {
      <h1>{{ p.name }}</h1>
      <p>Price: {{ p.price }} €</p>
    } @else {
      <h1>Product not found</h1>
    }
    <button type="button" (click)="back()">Back to the list</button>
  `,
})
export class ProductDetail {
  private readonly router = inject(Router);

  /** The route parameter :id – a string in the URL, turned into a number. */
  readonly id = input.required({ transform: numberAttribute });

  protected readonly product = computed(() => PRODUCTS.find((p) => p.id === this.id()));

  protected back(): void {
    // Navigating from code, e.g. after saving a form
    void this.router.navigate(['/products']);
  }
}

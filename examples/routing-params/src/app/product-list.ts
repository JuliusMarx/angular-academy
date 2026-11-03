import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PRODUCTS } from './products';

@Component({
  selector: 'app-product-list',
  imports: [RouterLink],
  template: `
    <h1>Products</h1>
    <p>
      Sort:
      <!-- queryParams end up in the URL as ?sort=… -->
      <a routerLink="." [queryParams]="{ sort: 'name' }">by name</a> ·
      <a routerLink="." [queryParams]="{ sort: 'price' }">by price</a>
    </p>
    <ul>
      @for (p of sorted(); track p.id) {
        <!-- ['/products', p.id] builds the URL /products/2 -->
        <li><a [routerLink]="['/products', p.id]">{{ p.name }}</a> – {{ p.price }} €</li>
      }
    </ul>
  `,
})
export class ProductList {
  /** Filled from the query parameter ?sort=… thanks to withComponentInputBinding(). */
  readonly sort = input<string>();

  protected readonly sorted = computed(() =>
    [...PRODUCTS].sort((a, b) => (this.sort() === 'price' ? a.price - b.price : a.name.localeCompare(b.name))),
  );
}

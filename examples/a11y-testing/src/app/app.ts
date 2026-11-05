import { Component, computed, signal } from '@angular/core';

interface Product {
  id: number;
  name: string;
  inStock: boolean;
}

@Component({
  selector: 'app-root',
  template: `
    <h1>Shop</h1>

    <button type="button" [attr.aria-pressed]="onlyInStock()" (click)="onlyInStock.set(!onlyInStock())">
      Only in stock
    </button>

    <ul>
      @for (product of visible(); track product.id) {
        <li>
          {{ product.name }}
          <!-- Try it: turn this button into a <div (click)> and run the tests again -->
          <button type="button" [attr.aria-label]="'Add ' + product.name + ' to cart'" [disabled]="!product.inStock" (click)="add(product)">
            Add
          </button>
        </li>
      }
    </ul>

    <!-- Always in the DOM – only its text changes, so screen readers announce it -->
    <p role="status">{{ message() }}</p>
  `,
  styles: `
    [aria-pressed='true'] {
      background: #1a73e8;
      color: white;
    }
    li button {
      margin-inline-start: 0.5rem;
    }
  `,
})
export class App {
  private readonly products: Product[] = [
    { id: 1, name: 'Mug', inStock: true },
    { id: 2, name: 'Lamp', inStock: false },
    { id: 3, name: 'Notebook', inStock: true },
  ];
  protected readonly onlyInStock = signal(false);
  protected readonly visible = computed(() => this.products.filter((p) => !this.onlyInStock() || p.inStock));
  protected readonly message = signal('');

  protected add(product: Product): void {
    this.message.set(`${product.name} added to cart`);
  }
}

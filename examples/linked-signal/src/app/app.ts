import { Component, linkedSignal, signal } from '@angular/core';

const SIZES: Record<string, string[]> = {
  'T-Shirt': ['S', 'M', 'L', 'XL'],
  Hoodie: ['S', 'M', 'L', 'XL', 'XXL'],
  Shoes: ['40', '41', '42', '43', '44'],
  Cap: ['One size'],
};

@Component({
  selector: 'app-root',
  template: `
    <h1>Product configurator</h1>

    <p>
      Product:
      @for (p of products; track p) {
        <button type="button" [disabled]="p === product()" (click)="product.set(p)">{{ p }}</button>
      }
    </p>

    <p>
      Size:
      @for (s of sizes(); track s) {
        <button type="button" [disabled]="s === size()" (click)="size.set(s)">{{ s }}</button>
      }
    </p>

    <p>Selected: <strong>{{ product() }}, size {{ size() }}</strong></p>
  `,
})
export class App {
  protected readonly products = Object.keys(SIZES);
  protected readonly product = signal('T-Shirt');

  protected sizes(): string[] {
    return SIZES[this.product()];
  }

  // Writable like a signal, but reset whenever the source (product) changes.
  // Keeps the previous size if the new product offers it as well.
  protected readonly size = linkedSignal<string, string>({
    source: this.product,
    computation: (product, previous) => {
      const sizes = SIZES[product];
      return previous && sizes.includes(previous.value) ? previous.value : sizes[0];
    },
  });
}

import { Component, signal } from '@angular/core';
import { ProductCard } from './product-card';

@Component({
  selector: 'app-root',
  imports: [ProductCard],
  template: `
    <h1>Shop</h1>

    <div class="grid">
      <!-- Bind a value with [ ] … -->
      <app-product-card [name]="'Coffee mug'" [price]="12.5" />

      <!-- … or pass a static string without [ ] -->
      <app-product-card name="Notebook" price="4.9" />

      <!-- A boolean attribute: just its presence means true -->
      <app-product-card name="Backpack" [price]="price()" soldOut />
    </div>

    <button type="button" (click)="price.update((p) => p + 5)">Raise backpack price</button>

    <!-- Try it: remove [name] from a card – the required input causes a compile error -->
  `,
  styles: `
    .grid {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      margin-bottom: 1rem;
    }
  `,
})
export class App {
  protected readonly price = signal(49);
}

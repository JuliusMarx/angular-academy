import { Component, signal } from '@angular/core';
import { filterProducts, Product } from './products';

@Component({
  selector: 'app-root',
  template: `
    <h1>Shop</h1>

    <label>Filter <input id="filter" [value]="query()" (input)="query.set($any($event.target).value)" /></label>
    <button type="button" (click)="likes.set(likes() + 1)">❤ {{ likes() }}</button>
    <button type="button" (click)="addAtTop()">Add product at the top</button>

    <ul>
      <!-- TODO 2: track each product by its id instead of its position -->
      @for (p of visible(); track $index) {
        <li>{{ p.name }}</li>
      }
    </ul>
  `,
})
export class App {
  private nextId = 4;
  protected readonly query = signal('');
  protected readonly likes = signal(0);
  protected readonly products = signal<Product[]>([
    { id: 1, name: 'Keyboard' },
    { id: 2, name: 'Mouse' },
    { id: 3, name: 'Monitor' },
  ]);

  // TODO 1: this method runs on every update of the page – even when you only click ❤.
  //         Turn it into a computed() so it only filters again when products or query change.
  protected visible(): Product[] {
    return filterProducts(this.products(), this.query());
  }

  protected addAtTop(): void {
    const id = this.nextId++;
    this.products.update((list) => [{ id, name: `New product ${id}` }, ...list]);
  }
}

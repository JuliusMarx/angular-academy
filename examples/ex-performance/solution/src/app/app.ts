import { Component, computed, signal } from '@angular/core';
import { filterProducts, Product } from './products';

@Component({
  selector: 'app-root',
  template: `
    <h1>Shop</h1>

    <label>Filter <input id="filter" [value]="query()" (input)="query.set($any($event.target).value)" /></label>
    <button type="button" (click)="likes.set(likes() + 1)">❤ {{ likes() }}</button>
    <button type="button" (click)="addAtTop()">Add product at the top</button>

    <ul>
      @for (p of visible(); track p.id) {
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

  protected readonly visible = computed(() => filterProducts(this.products(), this.query()));

  protected addAtTop(): void {
    const id = this.nextId++;
    this.products.update((list) => [{ id, name: `New product ${id}` }, ...list]);
  }
}

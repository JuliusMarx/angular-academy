import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <h1>Shopping list</h1>

    <input #item id="item" placeholder="What do you need?" />
    <button type="button" (click)="add(item.value); item.value = ''">Add</button>

    <ul id="list">
      @for (entry of items(); track $index) {
        <li>{{ entry }}</li>
      }
    </ul>

    @let count = items().length;
    <p id="count">{{ count }} items</p>
  `,
})
export class App {
  protected readonly items = signal(['Milk', 'Bread']);

  protected add(entry: string): void {
    if (entry.trim()) this.items.update((items) => [...items, entry.trim()]);
  }
}

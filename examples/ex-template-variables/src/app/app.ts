import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <h1>Shopping list</h1>

    <!-- TODO 1: give the input a template reference variable, e.g. #item -->
    <input id="item" placeholder="What do you need?" />

    <!-- TODO 2: on click, call add() with the input's value – then clear the input -->
    <button type="button">Add</button>

    <ul id="list">
      @for (entry of items(); track $index) {
        <li>{{ entry }}</li>
      }
    </ul>

    <!-- TODO 3: with @let, store items().length and show "<n> items" in <p id="count"> -->
  `,
})
export class App {
  protected readonly items = signal(['Milk', 'Bread']);

  protected add(entry: string): void {
    if (entry.trim()) this.items.update((items) => [...items, entry.trim()]);
  }
}

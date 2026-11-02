import { Component, signal } from '@angular/core';

const CATALOG: Record<string, string[]> = {
  Fruit: ['Apple', 'Banana', 'Cherry'],
  Vegetables: ['Carrot', 'Leek', 'Pea'],
};

@Component({
  selector: 'app-root',
  template: `
    <h1>Pick something</h1>

    <p>
      @for (c of categories; track c) {
        <button type="button" [disabled]="c === category()" (click)="category.set(c)">{{ c }}</button>
      }
    </p>
    <p>
      @for (item of items(); track item) {
        <button type="button" class="item" (click)="selected.set(item)">{{ item }}</button>
      }
    </p>

    <p>Selected: <strong id="selected">{{ selected() }}</strong></p>
  `,
})
export class App {
  protected readonly categories = Object.keys(CATALOG);
  protected readonly category = signal('Fruit');

  protected items(): string[] {
    return CATALOG[this.category()];
  }

  // Bug: when the category changes, "selected" keeps an item from the old category.
  // TODO: turn it into a linkedSignal() that resets to the first item of the new category.
  protected readonly selected = signal('Apple');
}

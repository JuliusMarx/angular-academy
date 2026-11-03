import { Component, computed, input, numberAttribute } from '@angular/core';
import { BOOKS } from './books';

@Component({
  selector: 'app-book-detail',
  template: `
    @if (book(); as b) {
      <h1>{{ b.title }}</h1>
      <p>by {{ b.author }}</p>
    } @else {
      <h1>Book not found</h1>
    }
  `,
})
export class BookDetail {
  /** Should be filled from the route parameter :id – see app.config.ts. */
  readonly id = input(0, { transform: numberAttribute });

  protected readonly book = computed(() => BOOKS.find((b) => b.id === this.id()));
}

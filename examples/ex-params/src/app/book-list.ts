import { Component } from '@angular/core';
import { BOOKS } from './books';

@Component({
  selector: 'app-book-list',
  // TODO 3: link every title to its detail page /books/<id> (import RouterLink)
  template: `
    <h1>Books</h1>
    <ul>
      @for (book of books; track book.id) {
        <li><a>{{ book.title }}</a></li>
      }
    </ul>
  `,
})
export class BookList {
  protected readonly books = BOOKS;
}

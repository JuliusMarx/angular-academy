import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BOOKS } from './books';

@Component({
  selector: 'app-book-list',
  imports: [RouterLink],
  template: `
    <h1>Books</h1>
    <ul>
      @for (book of books; track book.id) {
        <li><a [routerLink]="['/books', book.id]">{{ book.title }}</a></li>
      }
    </ul>
  `,
})
export class BookList {
  protected readonly books = BOOKS;
}

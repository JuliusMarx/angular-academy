import { Component } from '@angular/core';
import { ProductList } from './product-list';

@Component({
  selector: 'app-root',
  imports: [ProductList],
  template: `
    <header>
      <!-- TODO 3: show the number of favorites from the service -->
      <strong>Favorites: <span id="fav-count">0</span></strong>
    </header>
    <h1>Shop</h1>
    <app-product-list />
  `,
})
export class App {}

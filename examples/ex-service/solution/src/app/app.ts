import { Component, inject } from '@angular/core';
import { FavoritesService } from './favorites.service';
import { ProductList } from './product-list';

@Component({
  selector: 'app-root',
  imports: [ProductList],
  template: `
    <header>
      <strong>Favorites: <span id="fav-count">{{ favorites.count() }}</span></strong>
    </header>
    <h1>Shop</h1>
    <app-product-list />
  `,
})
export class App {
  protected readonly favorites = inject(FavoritesService);
}

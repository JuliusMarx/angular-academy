import { Component, inject } from '@angular/core';
import { FavoritesService } from './favorites.service';

@Component({
  selector: 'app-product-list',
  template: `
    @for (name of products; track name) {
      <p>
        {{ name }}
        <button type="button" [attr.aria-pressed]="favorites.isFavorite(name)" (click)="favorites.toggle(name)">
          ♥ {{ name }}
        </button>
      </p>
    }
  `,
})
export class ProductList {
  protected readonly favorites = inject(FavoritesService);
  protected readonly products = ['Mug', 'T-Shirt', 'Sticker'];
}

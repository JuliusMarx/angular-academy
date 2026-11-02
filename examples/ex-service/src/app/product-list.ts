import { Component } from '@angular/core';

@Component({
  selector: 'app-product-list',
  template: `
    @for (name of products; track name) {
      <p>
        {{ name }}
        <!-- TODO 2: toggle the favorite via the service, and set aria-pressed to whether it is a favorite -->
        <button type="button">♥ {{ name }}</button>
      </p>
    }
  `,
})
export class ProductList {
  protected readonly products = ['Mug', 'T-Shirt', 'Sticker'];
}

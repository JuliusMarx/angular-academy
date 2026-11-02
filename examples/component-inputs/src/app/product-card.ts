import { booleanAttribute, Component, computed, input, numberAttribute } from '@angular/core';

@Component({
  selector: 'app-product-card',
  template: `
    <article [class.sold-out]="soldOut()">
      <h2>{{ name() }}</h2>
      <p>{{ formattedPrice() }}</p>
      @if (soldOut()) {
        <strong>Sold out</strong>
      }
    </article>
  `,
  styles: `
    article {
      width: 10rem;
      padding: 1rem;
      border: 1px solid #ccc;
      border-radius: 0.5rem;
    }
    .sold-out {
      opacity: 0.6;
    }
    h2 {
      margin: 0 0 0.5rem;
      font-size: 1.1rem;
    }
  `,
})
export class ProductCard {
  /** Must be set by the parent – otherwise the template does not compile. */
  readonly name = input.required<string>();

  /** Accepts numbers and strings like "4.9" thanks to the transform. */
  readonly price = input(0, { transform: numberAttribute });

  /** <app-product-card soldOut /> is enough to set it to true. */
  readonly soldOut = input(false, { transform: booleanAttribute });

  protected readonly formattedPrice = computed(() => `${this.price().toFixed(2)} €`);
}

import { Component } from '@angular/core';
import { PriceTag } from './price-tag';

@Component({
  selector: 'app-root',
  imports: [PriceTag],
  template: `
    <h1>Prices</h1>

    <p>Coffee: <app-price-tag /></p>
    <p>Bagel: <app-price-tag /></p>

    <!-- TODO 3: pass amount 12.5 to the first tag, and amount 4.9 with currency "USD" to the second -->
  `,
})
export class App {}

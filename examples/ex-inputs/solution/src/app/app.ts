import { Component } from '@angular/core';
import { PriceTag } from './price-tag';

@Component({
  selector: 'app-root',
  imports: [PriceTag],
  template: `
    <h1>Prices</h1>

    <p>Coffee: <app-price-tag [amount]="12.5" /></p>
    <p>Bagel: <app-price-tag [amount]="4.9" currency="USD" /></p>
  `,
})
export class App {}

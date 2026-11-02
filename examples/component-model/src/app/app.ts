import { Component, signal } from '@angular/core';
import { QuantityPicker } from './quantity-picker';
import { ToggleSwitch } from './toggle-switch';

@Component({
  selector: 'app-root',
  imports: [QuantityPicker, ToggleSwitch],
  template: `
    <h1>Order</h1>

    <!-- [( )] – "banana in a box" – binds in both directions -->
    <p>Quantity: <app-quantity-picker [(value)]="quantity" [max]="10" /></p>
    <p>
      <app-toggle-switch [(checked)]="giftWrap" />
      Gift wrap
    </p>

    <hr />
    <p>Parent sees: {{ quantity() }} × mug{{ giftWrap() ? ', gift-wrapped' : '' }}</p>
    <button type="button" (click)="quantity.set(1); giftWrap.set(false)">Reset from parent</button>
  `,
})
export class App {
  protected readonly quantity = signal(1);
  protected readonly giftWrap = signal(false);
}

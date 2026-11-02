import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-price-tag',
  template: `<span class="price-tag">{{ formatted() }} {{ currency() }}</span>`,
})
export class PriceTag {
  readonly amount = input.required<number>();
  readonly currency = input('EUR');

  protected readonly formatted = computed(() => this.amount().toFixed(2));
}

import { Component, model, output } from '@angular/core';

export const RATING_TEMPLATE = `
  @for (star of stars; track star) {
    <button type="button" [attr.aria-label]="'Rate ' + star" [attr.aria-pressed]="star <= value()" (click)="rate(star)">★</button>
  }
  <span class="label">{{ value() }} / 5</span>
`;

@Component({
  selector: 'app-rating',
  template: RATING_TEMPLATE,
})
export class Rating {
  readonly value = model(0);
  readonly rated = output<number>();
  protected readonly stars = [1, 2, 3, 4, 5];

  rate(star: number): void {
    this.value.set(star);
    this.rated.emit(star);
  }
}

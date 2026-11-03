// Broken versions of Rating – your tests should notice each one. No peeking needed. 😉
import { Component, signal } from '@angular/core';
import { Rating, RATING_TEMPLATE } from '../app/rating';

/** Shows its own counter instead of the value input. */
@Component({
  selector: 'app-rating',
  template: `
    @for (star of stars; track star) {
      <button type="button" [attr.aria-label]="'Rate ' + star" [attr.aria-pressed]="star <= shown()" (click)="rate(star)">★</button>
    }
    <span class="label">{{ shown() }} / 5</span>
  `,
})
export class InputMutant extends Rating {
  protected readonly shown = signal(0);
  override rate(star: number): void {
    this.shown.set(star);
    this.rated.emit(star);
  }
}

/** Emits, but forgets to update the value. */
@Component({ selector: 'app-rating', template: RATING_TEMPLATE })
export class ClickMutant extends Rating {
  override rate(star: number): void {
    this.rated.emit(star);
  }
}

/** Updates the value, but never emits. */
@Component({ selector: 'app-rating', template: RATING_TEMPLATE })
export class EmitMutant extends Rating {
  override rate(star: number): void {
    this.value.set(star);
  }
}

import { Component, output, signal } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  template: `
    <div role="group" aria-label="Rating">
      @for (star of stars; track star) {
        <button
          type="button"
          [class.active]="star <= selected()"
          [attr.aria-label]="star === 1 ? '1 star' : star + ' stars'"
          (click)="select(star)"
        >
          ★
        </button>
      }
      <button type="button" class="clear" (click)="clear()">Clear</button>
    </div>
  `,
  styles: `
    button {
      font-size: 1.6rem;
      border: none;
      background: none;
      color: #ccc;
      cursor: pointer;
    }
    .active {
      color: #f5a623;
    }
    .clear {
      font-size: 0.9rem;
      color: inherit;
      text-decoration: underline;
    }
  `,
})
export class StarRating {
  /** Emits the number of stars whenever the user picks a rating. */
  readonly rated = output<number>();
  /** Outputs don't need a value: output<void>() works too. */
  readonly cleared = output<void>();

  protected readonly stars = [1, 2, 3, 4, 5];
  protected readonly selected = signal(0);

  protected select(star: number): void {
    this.selected.set(star);
    this.rated.emit(star);
  }

  protected clear(): void {
    this.selected.set(0);
    this.cleared.emit();
  }
}

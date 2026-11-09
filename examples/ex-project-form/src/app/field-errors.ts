import { Component, input } from '@angular/core';
import { FieldTree } from '@angular/forms/signals';

/** Shows a field's error messages – but only after the user has touched it. */
@Component({
  selector: 'app-field-errors',
  template: `
    @if (field()().touched()) {
      @for (error of field()().errors(); track error.kind) {
        <!-- data-kind lets the exercise checks find an error by its kind -->
        <small class="error" [attr.data-kind]="error.kind">{{ error.message }}</small>
      }
    }
  `,
  styles: `
    .error {
      display: block;
      color: #b3261e;
    }
  `,
})
export class FieldErrors {
  readonly field = input.required<FieldTree<unknown>>();
}

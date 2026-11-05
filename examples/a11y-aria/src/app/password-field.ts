import { Component, computed, signal } from '@angular/core';

/** Counter outside the class: every instance gets its own ids. */
let nextId = 0;

@Component({
  selector: 'app-password-field',
  template: `
    <label [for]="id">Password</label>
    <input
      [id]="id"
      type="password"
      [attr.aria-describedby]="id + '-hint'"
      [attr.aria-invalid]="tooShort() ? true : null"
      (input)="value.set(field.value)"
      #field
    />
    <p [id]="id + '-hint'" [class.error]="tooShort()">
      At least 8 characters{{ tooShort() ? ' – still ' + (8 - value().length) + ' to go' : '' }}.
    </p>
  `,
  styles: `
    input {
      display: block;
      padding: 0.4rem;
      font: inherit;
    }
    p {
      margin-block: 0.25rem 1rem;
      color: #555;
    }
    .error {
      color: #b00020;
    }
  `,
})
export class PasswordField {
  protected readonly id = `password-${nextId++}`;
  protected readonly value = signal('');
  protected readonly tooShort = computed(() => this.value().length > 0 && this.value().length < 8);
}

import { JsonPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [JsonPipe, ReactiveFormsModule],
  template: `
    <h1>Contact</h1>

    <!-- [formGroup] connects the <form> to the FormGroup, formControlName each input to a control -->
    <form [formGroup]="contact" (ngSubmit)="send()">
      <p>
        <label>Name <input formControlName="name" /></label>
        @if (contact.controls.name.touched && contact.controls.name.hasError('required')) {
          <small class="error">Please enter your name.</small>
        }
      </p>
      <p>
        <label>Email <input type="email" formControlName="email" /></label>
        @if (contact.controls.email.touched && contact.controls.email.hasError('email')) {
          <small class="error">That is not a valid email address.</small>
        }
      </p>
      <p>
        <label>Message <textarea formControlName="message" rows="3"></textarea></label>
        @if (contact.controls.message.touched && contact.controls.message.hasError('minlength')) {
          <small class="error">At least 10 characters.</small>
        }
      </p>
      <button type="submit" [disabled]="contact.invalid">Send</button>
    </form>

    <h2>Form value</h2>
    <pre>{{ contact.value | json }}</pre>
    <p>Valid: {{ contact.valid }} · Touched: {{ contact.touched }}</p>

    @if (sent()) {
      <p class="success">Message sent.</p>
    }
  `,
  styles: `
    .error {
      display: block;
      color: #b3261e;
    }
    .success {
      color: #1e7f4f;
    }
  `,
})
export class App {
  private readonly fb = inject(FormBuilder);

  /** nonNullable: reset() goes back to '' instead of null. */
  protected readonly contact = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  protected readonly sent = signal(false);

  protected send(): void {
    if (this.contact.invalid) return;
    // getRawValue() is fully typed: { name: string; email: string; message: string }
    console.log('send', this.contact.getRawValue());
    this.sent.set(true);
    this.contact.reset();
  }
}

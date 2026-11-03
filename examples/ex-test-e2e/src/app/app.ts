import { Component, signal } from '@angular/core';

export const NEWSLETTER_TEMPLATE = `
  <h1>Newsletter</h1>

  @if (subscribed(); as address) {
    <p role="status">Thanks! We sent a confirmation to {{ address }}.</p>
  } @else {
    <form (submit)="subscribe($event)" novalidate>
      <label for="email">Email</label>
      <input id="email" type="email" #field [value]="email()" (input)="email.set(field.value)" />
      <button type="submit">Subscribe</button>
      @if (error()) {
        <p role="alert">{{ error() }}</p>
      }
    </form>
  }
`;

export const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

@Component({
  selector: 'app-root',
  template: NEWSLETTER_TEMPLATE,
})
export class App {
  protected readonly email = signal('');
  protected readonly error = signal('');
  protected readonly subscribed = signal('');

  protected subscribe(event: Event): void {
    event.preventDefault();
    const address = this.email().trim();
    if (!isValidEmail(address)) {
      this.error.set('Please enter a valid email address.');
      return;
    }
    this.error.set('');
    this.subscribed.set(address);
  }
}

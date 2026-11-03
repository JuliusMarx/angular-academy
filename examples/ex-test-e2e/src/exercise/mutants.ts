// Broken versions of the newsletter app – your tests should notice each one. No peeking needed. 😉
import { Component } from '@angular/core';
import { App, NEWSLETTER_TEMPLATE } from '../app/app';

/** Accepts every address, even invalid ones. */
@Component({ selector: 'app-root', template: NEWSLETTER_TEMPLATE })
export class ValidationMutant extends App {
  protected override subscribe(event: Event): void {
    event.preventDefault();
    this.subscribed.set(this.email().trim() || ' ');
  }
}

/** Validates, but never confirms a valid address. */
@Component({ selector: 'app-root', template: NEWSLETTER_TEMPLATE })
export class ConfirmationMutant extends App {
  protected override subscribe(event: Event): void {
    event.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email().trim());
    this.error.set(valid ? '' : 'Please enter a valid email address.');
  }
}

/** Confirms, but with only part of the address. */
@Component({ selector: 'app-root', template: NEWSLETTER_TEMPLATE })
export class AddressMutant extends App {
  protected override subscribe(event: Event): void {
    super.subscribe(event);
    if (this.subscribed()) this.subscribed.set(this.subscribed().split('@')[0]);
  }
}

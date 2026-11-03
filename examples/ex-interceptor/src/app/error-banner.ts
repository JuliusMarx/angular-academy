import { Injectable, signal } from '@angular/core';

/** A message bar at the top of the page – any part of the app can show a message in it. */
@Injectable({ providedIn: 'root' })
export class ErrorBanner {
  readonly message = signal('');

  show(message: string): void {
    this.message.set(message);
  }
}

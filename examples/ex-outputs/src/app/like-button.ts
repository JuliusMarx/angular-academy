import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-like-button',
  template: `<button type="button" (click)="like()">👍 Like ({{ count() }})</button>`,
})
export class LikeButton {
  protected readonly count = signal(0);

  // TODO 1: add an output "liked" that sends the new number of likes

  protected like(): void {
    this.count.update((n) => n + 1);
    // TODO 2: emit the new count
  }
}

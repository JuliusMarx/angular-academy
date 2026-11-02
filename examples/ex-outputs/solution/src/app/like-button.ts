import { Component, output, signal } from '@angular/core';

@Component({
  selector: 'app-like-button',
  template: `<button type="button" (click)="like()">👍 Like ({{ count() }})</button>`,
})
export class LikeButton {
  protected readonly count = signal(0);
  readonly liked = output<number>();

  protected like(): void {
    this.count.update((n) => n + 1);
    this.liked.emit(this.count());
  }
}

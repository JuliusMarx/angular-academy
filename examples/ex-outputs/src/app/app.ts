import { Component, signal } from '@angular/core';
import { LikeButton } from './like-button';

@Component({
  selector: 'app-root',
  imports: [LikeButton],
  template: `
    <h1>Post</h1>
    <p>Signals make Angular apps fast and simple.</p>

    <!-- TODO 3: listen to (liked) and store the value in "likes" -->
    <app-like-button />

    <p id="total">This post has {{ likes() }} likes.</p>
  `,
})
export class App {
  protected readonly likes = signal(0);
}

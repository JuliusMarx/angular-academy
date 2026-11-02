import { UpperCasePipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { InitialsPipe } from './initials.pipe';
import { TruncatePipe } from './truncate.pipe';

interface Comment {
  author: string;
  text: string;
}

@Component({
  selector: 'app-root',
  imports: [InitialsPipe, TruncatePipe, UpperCasePipe],
  template: `
    <h1>Comments</h1>

    <label>
      Max. length: {{ max() }}
      <input type="range" min="10" max="120" [value]="max()" (input)="onMax($event)" />
    </label>

    @for (c of comments; track c.author) {
      <div class="comment">
        <span class="avatar" aria-hidden="true">{{ c.author | initials }}</span>
        <div>
          <!-- Pipes can be chained: the output of one is the input of the next -->
          <strong>{{ c.author | uppercase }}</strong>
          <p>{{ c.text | truncate: max() }}</p>
        </div>
      </div>
    }

    <!-- Try it: pass a different suffix, e.g. truncate: max() : ' [more]' -->
  `,
  styles: `
    .comment {
      display: flex;
      gap: 0.75rem;
      margin: 1rem 0;
    }
    .avatar {
      flex: none;
      display: grid;
      place-items: center;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      background: #fce4ee;
      color: #a3134c;
      font-weight: 700;
    }
    p {
      margin: 0.2rem 0 0;
    }
  `,
})
export class App {
  protected readonly max = signal(40);
  protected readonly comments: Comment[] = [
    { author: 'Grace Brewster Hopper', text: 'The most dangerous phrase in the language is: we have always done it this way.' },
    { author: 'Alan Turing', text: 'We can only see a short distance ahead, but we can see plenty there that needs to be done.' },
    { author: 'Ada', text: 'Short comment.' },
  ];

  protected onMax(event: Event): void {
    this.max.set(Number((event.target as HTMLInputElement).value));
  }
}

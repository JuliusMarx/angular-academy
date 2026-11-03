import { Component, computed, inject, signal } from '@angular/core';
import { Notifications } from './notifications';

@Component({
  selector: 'app-root',
  template: `
    <h1>Notifications</h1>

    <button type="button" (click)="notifications.simulate('Build passed')">Build passed</button>
    <button type="button" (click)="notifications.simulate('Deploy failed')">Deploy failed</button>
    <button type="button" (click)="notifications.simulate('Build failed')">Build failed</button>

    <p>Latest: <strong id="latest">{{ latest() }}</strong></p>
    <p id="count">{{ history().length }} messages</p>

    <label>Filter <input id="keyword" [value]="keyword()" (input)="keyword.set($any($event.target).value)" /></label>
    <ul id="matching">
      @for (message of matching(); track $index) {
        <li>{{ message }}</li>
      }
    </ul>
  `,
})
export class App {
  protected readonly notifications = inject(Notifications);

  // TODO 1: turn notifications.messages$ into a signal with toSignal() (initial value 'No messages yet')
  protected readonly latest = signal('No messages yet');

  // TODO 2: collect all messages in a list – messages$.pipe(scan(...)) and toSignal() with initialValue []
  protected readonly history = signal<string[]>([]);

  protected readonly keyword = signal('');
  // TODO 3: debounce the keyword by 300 ms – toObservable(), debounceTime() and back with toSignal()
  //         Then filter the history with the debounced keyword (case-insensitive).
  protected readonly matching = computed(() => this.history());
}

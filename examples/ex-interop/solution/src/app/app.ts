import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, scan } from 'rxjs';
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

  protected readonly latest = toSignal(this.notifications.messages$, { initialValue: 'No messages yet' });

  protected readonly history = toSignal(
    this.notifications.messages$.pipe(scan((all, message) => [...all, message], [] as string[])),
    { initialValue: [] },
  );

  protected readonly keyword = signal('');
  private readonly debouncedKeyword = toSignal(toObservable(this.keyword).pipe(debounceTime(300)), { initialValue: '' });
  protected readonly matching = computed(() => {
    const keyword = this.debouncedKeyword().toLowerCase();
    return this.history().filter((m) => m.toLowerCase().includes(keyword));
  });
}

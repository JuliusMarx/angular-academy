import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { rxResource, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, interval, map, switchMap } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [DatePipe],
  template: `
    <h1>Signals ⇄ RxJS</h1>

    <p>It is {{ now() | date: 'HH:mm:ss' }}</p>

    <h2>Search (toObservable → operators → toSignal)</h2>
    <label>Search <input [value]="query()" (input)="query.set($any($event.target).value)" /></label>
    <p>{{ resultCount() }} matches</p>
    <ul>
      @for (country of results(); track country) {
        <li>{{ country }}</li>
      }
    </ul>

    <h2>rxResource</h2>
    <button type="button" (click)="letter.set('A')">A</button>
    <button type="button" (click)="letter.set('S')">S</button>
    <button type="button" (click)="letter.set('X')">X</button>
    @if (byLetter.isLoading()) {
      <p>Loading …</p>
    } @else {
      <p>Starting with {{ letter() }}: {{ byLetter.value()?.join(', ') || 'none' }}</p>
    }
  `,
})
export class App {
  private readonly http = inject(HttpClient);
  private readonly all$ = this.http.get<string[]>('/api/countries.json');

  /** Observable → signal: toSignal subscribes and unsubscribes with the component. */
  protected readonly now = toSignal(interval(1000).pipe(map(() => Date.now())), { initialValue: Date.now() });

  /** Signal → observable: toObservable emits whenever the signal changes. */
  protected readonly query = signal('');
  protected readonly results = toSignal(
    toObservable(this.query).pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((q) => this.all$.pipe(map((all) => (q ? all.filter((c) => c.toLowerCase().includes(q.toLowerCase())) : [])))),
    ),
    { initialValue: [] },
  );
  protected readonly resultCount = computed(() => this.results().length);

  /** Like resource(), but the loader returns an Observable. */
  protected readonly letter = signal('A');
  protected readonly byLetter = rxResource({
    params: () => this.letter(),
    stream: ({ params }) => this.all$.pipe(map((all) => all.filter((c) => c.startsWith(params)))),
  });
}

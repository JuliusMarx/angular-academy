import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, filter, map, Subject, switchMap } from 'rxjs';
import { CountryService } from './country.service';

@Component({
  selector: 'app-root',
  template: `
    <h1>Country search</h1>

    <label>
      Search
      <input #box (input)="query$.next(box.value)" placeholder="at least 2 letters" />
    </label>
    <p>Requests sent: {{ countries.requests() }}</p>

    <ul>
      @for (country of results(); track country) {
        <li>{{ country }}</li>
      }
    </ul>
  `,
})
export class App {
  protected readonly countries = inject(CountryService);

  /** Every keystroke goes into this Subject … */
  protected readonly query$ = new Subject<string>();

  /** … and the pipeline decides what becomes a request. */
  protected readonly results = toSignal(
    this.query$.pipe(
      map((q) => q.trim()),
      filter((q) => q.length >= 2), // ignore very short input
      debounceTime(300), // wait until the user pauses typing
      distinctUntilChanged(), // same query as before? skip it
      switchMap((q) => this.countries.search(q)), // cancel the old request when a new query arrives
    ),
    { initialValue: [] },
  );
}

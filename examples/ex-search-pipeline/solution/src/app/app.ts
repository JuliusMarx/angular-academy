import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, filter, map, Subject, switchMap } from 'rxjs';
import { CountryService } from './country.service';

@Component({
  selector: 'app-root',
  template: `
    <h1>Country search</h1>
    <label>Search <input id="search" #box (input)="query$.next(box.value)" /></label>
    <p>Requests sent: <span id="requests">{{ countries.requests() }}</span></p>
    <ul>
      @for (country of results(); track country) {
        <li>{{ country }}</li>
      }
    </ul>
  `,
})
export class App {
  protected readonly countries = inject(CountryService);
  protected readonly query$ = new Subject<string>();

  protected readonly results = toSignal(
    this.query$.pipe(
      map((q) => q.trim()),
      filter((q) => q.length >= 2),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((q) => this.countries.search(q)),
    ),
    { initialValue: [] },
  );
}

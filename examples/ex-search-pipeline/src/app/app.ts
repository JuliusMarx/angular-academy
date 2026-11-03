import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subject, switchMap } from 'rxjs';
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

  // TODO: add operators before switchMap, so that
  //   1. spaces around the query don't count (map + trim)
  //   2. queries shorter than 2 letters send no request (filter)
  //   3. a request is only sent after a typing pause of 300 ms (debounceTime)
  //   4. the same query isn't sent twice in a row (distinctUntilChanged)
  protected readonly results = toSignal(this.query$.pipe(switchMap((q) => this.countries.search(q))), {
    initialValue: [],
  });
}

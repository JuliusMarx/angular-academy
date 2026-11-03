import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { delay, map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CountryService {
  private readonly http = inject(HttpClient);
  /** Counts requests so you can see what debounceTime and switchMap save. */
  readonly requests = signal(0);

  /** Pretends to be a search API: loads all countries and filters them. */
  search(query: string): Observable<string[]> {
    this.requests.update((n) => n + 1);
    return this.http.get<string[]>('/api/countries.json').pipe(
      delay(Math.random() * 600), // slow, unpredictable network
      map((all) => all.filter((c) => c.toLowerCase().includes(query.toLowerCase()))),
    );
  }
}

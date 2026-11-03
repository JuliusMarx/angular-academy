import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, Observable } from 'rxjs';

/** Plays a search API – you don't need to change this file. */
@Injectable({ providedIn: 'root' })
export class CountryService {
  private readonly http = inject(HttpClient);
  readonly requests = signal(0);

  search(query: string): Observable<string[]> {
    this.requests.update((n) => n + 1);
    return this.http
      .get<string[]>('/api/countries.json')
      .pipe(map((all) => all.filter((c) => c.toLowerCase().includes(query.toLowerCase()))));
  }
}

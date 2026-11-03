import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';

interface WeatherResponse {
  city: string;
  temperature: number;
}

@Injectable({ providedIn: 'root' })
export class Weather {
  private readonly http = inject(HttpClient);

  /** E.g. "12 °C" – or "Unknown city" if the server answers with an error. */
  forecast(city: string): Observable<string> {
    return this.http.get<WeatherResponse>('/api/weather', { params: { city } }).pipe(
      map((w) => `${Math.round(w.temperature)} °C`),
      catchError(() => of('Unknown city')),
    );
  }
}

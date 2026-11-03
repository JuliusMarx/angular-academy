// Broken versions of Weather – your tests should notice each one. No peeking needed. 😉
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { Weather } from '../app/weather';

interface WeatherResponse {
  temperature: number;
}

/** Sends the city as ?q= instead of ?city=. */
@Injectable()
export class ParamMutant extends Weather {
  private readonly client = inject(HttpClient);
  override forecast(city: string): Observable<string> {
    return this.client.get<WeatherResponse>('/api/weather', { params: { q: city } }).pipe(
      map((w) => `${Math.round(w.temperature)} °C`),
      catchError(() => of('Unknown city')),
    );
  }
}

/** Cuts off the decimals instead of rounding. */
@Injectable()
export class RoundingMutant extends Weather {
  private readonly client = inject(HttpClient);
  override forecast(city: string): Observable<string> {
    return this.client.get<WeatherResponse>('/api/weather', { params: { city } }).pipe(
      map((w) => `${Math.trunc(w.temperature)} °C`),
      catchError(() => of('Unknown city')),
    );
  }
}

/** Lets errors through instead of answering "Unknown city". */
@Injectable()
export class ErrorMutant extends Weather {
  private readonly client = inject(HttpClient);
  override forecast(city: string): Observable<string> {
    return this.client
      .get<WeatherResponse>('/api/weather', { params: { city } })
      .pipe(map((w) => `${Math.round(w.temperature)} °C`));
  }
}

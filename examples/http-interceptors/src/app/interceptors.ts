import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { of, tap, throwError } from 'rxjs';
import { RequestLog } from './request-log';

/** Adds the token to every request to our API. */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith('/api/')) return next(req);
  // Requests are immutable – clone() creates a changed copy.
  return next(req.clone({ setHeaders: { Authorization: 'Bearer demo-token' } }));
};

/** Writes every request with its status and duration into the log. */
export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const log = inject(RequestLog);
  const started = Date.now();
  return next(req).pipe(
    tap({
      next: (event) => {
        if (event instanceof HttpResponse) log.add(`${req.method} ${req.url} → ${event.status} (${Date.now() - started} ms)`);
      },
      error: (error: HttpErrorResponse) => log.add(`${req.method} ${req.url} → ${error.status} (${Date.now() - started} ms)`),
    }),
  );
};

/**
 * Plays the server for /api/me: only answers with the right token.
 * (A static dev server can't check headers – in a real app the backend does this.)
 */
export const fakeBackendInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url !== '/api/me') return next(req);
  if (req.headers.get('Authorization') !== 'Bearer demo-token') {
    return throwError(() => new HttpErrorResponse({ status: 401, statusText: 'Unauthorized', url: req.url }));
  }
  return of(new HttpResponse({ status: 200, body: { name: 'Ada Lovelace', role: 'admin' } }));
};

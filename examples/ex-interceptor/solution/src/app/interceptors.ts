import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ErrorBanner } from './error-banner';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith('/api/')) return next(req);
  return next(req.clone({ setHeaders: { Authorization: 'Bearer demo-token' } }));
};

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const banner = inject(ErrorBanner);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      banner.show(`Request failed: ${error.status}`);
      return throwError(() => error);
    }),
  );
};

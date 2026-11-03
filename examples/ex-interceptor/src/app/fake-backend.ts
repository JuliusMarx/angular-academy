import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';

/**
 * Plays the server – you don't need to change this file.
 * /api/me only answers with the token "Bearer demo-token". The analytics service is a foreign
 * server: it rejects requests that carry our token, because it must never see it.
 */
export const fakeBackendInterceptor: HttpInterceptorFn = (req, next) => {
  const token = req.headers.get('Authorization');
  if (req.url === '/api/me') {
    return token === 'Bearer demo-token'
      ? of(new HttpResponse({ status: 200, body: { name: 'Ada Lovelace' } }))
      : throwError(() => new HttpErrorResponse({ status: 401, statusText: 'Unauthorized', url: req.url }));
  }
  if (req.url.startsWith('https://analytics.example.com/')) {
    return token
      ? throwError(() => new HttpErrorResponse({ status: 400, statusText: 'Token leaked to a foreign server', url: req.url }))
      : of(new HttpResponse({ status: 204 }));
  }
  return next(req);
};

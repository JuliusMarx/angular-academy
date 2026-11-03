import { HttpInterceptorFn } from '@angular/common/http';

/** TODO 1: add the header Authorization: Bearer demo-token – but only to requests to '/api/' */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};

/** TODO 2: on an HttpErrorResponse, show "Request failed: <status>" in the ErrorBanner and rethrow the error */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};

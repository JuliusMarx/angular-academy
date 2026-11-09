import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { delay, of } from 'rxjs';
import { Task } from './task';

let nextId = 100;

/**
 * Plays the server for writes – a static file server can't handle POST or PUT.
 * Nothing is stored: after a reload you see the tasks from tasks.json again.
 * Swap it for a real backend by removing it from app.config.ts.
 */
export const fakeBackendInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.method === 'POST' && req.url === '/api/tasks') {
    const task = { ...(req.body as Omit<Task, 'id'>), id: nextId++ };
    return of(new HttpResponse({ status: 201, body: task })).pipe(delay(400));
  }
  if (req.method === 'PUT' && /^\/api\/tasks\/\d+$/.test(req.url)) {
    return of(new HttpResponse({ status: 200, body: req.body })).pipe(delay(400));
  }
  return next(req); // GET goes to the dev server, which serves public/
};

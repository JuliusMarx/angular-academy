import { inject, Injectable, signal } from '@angular/core';
import { CanActivateFn, ResolveFn, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly loggedIn = signal(false);
}

/**
 * A guard is a function: true lets the navigation through, a UrlTree redirects instead.
 * inject() works here because Angular calls guards in an injection context.
 */
export const authGuard: CanActivateFn = (_route, state) => {
  if (inject(AuthService).loggedIn()) return true;
  // Remember where the user wanted to go, so the login page can send them back
  return inject(Router).createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};

export interface Profile {
  name: string;
  orders: number;
}

/** A resolver loads data before the route is activated – the page never shows "loading". */
export const profileResolver: ResolveFn<Profile> = () =>
  new Promise((resolve) => setTimeout(() => resolve({ name: 'Ada Lovelace', orders: 3 }), 500));

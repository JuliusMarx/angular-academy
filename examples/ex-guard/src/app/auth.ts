import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly loggedIn = signal(false);
}

// TODO 1: write a functional guard "authGuard" (CanActivateFn):
//   - logged in → let the navigation through
//   - logged out → redirect to /login (return a UrlTree via inject(Router).createUrlTree(...))

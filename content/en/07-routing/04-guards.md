---
title: Guards and resolvers
minutes: 9
summary: |-
  - A guard is a function (`CanActivateFn`): `true` lets the navigation continue, a `UrlTree` redirects, `false` only cancels.
  - Angular calls guards in an injection context, which is why `inject()` works.
  - You attach the guard to the route with `canActivate: [authGuard]`. Other kinds: `canActivateChild`, `canDeactivate`, `canMatch`.
  - A resolver (`ResolveFn`) loads data before the route is activated. With `withComponentInputBinding()`, the result arrives as an input under the name used in `resolve`.
  - While a resolver loads, the old page stays on screen – for slow loading, `resource()` in the component is often better.

  ```ts
  export const authGuard: CanActivateFn = (_route, state) => {
    if (inject(AuthService).loggedIn()) return true;
    return inject(Router).createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
  };
  ```

  > [!WARNING] A guard only protects the UI. Real access rights must always be checked by the server.
quiz:
  - question: What can a `CanActivateFn` guard return to redirect?
    options: ["false", "A UrlTree", "A string with the URL", "null"]
    answer: 1
    explanation: "`false` only cancels the navigation. A `UrlTree` redirects to another page instead."
  - question: Why does `inject()` work in a guard?
    options:
      - Guards are components
      - Angular calls guards in an injection context
      - inject() works everywhere
      - Because the guard is in app.config.ts
    answer: 1
  - question: What does a resolver do?
    options:
      - It checks whether the user is logged in
      - It loads data before the route is activated
      - It resolves merge conflicts
      - It translates URLs
    answer: 1
exercise:
  example: ex-guard
  title: Protect the admin area
  task: |-
    The page `/admin` can be reached by anyone. That should change.

    1. In `auth.ts`, write a guard `authGuard` (`CanActivateFn`): logged-in users may pass, everyone else is redirected to `/login`.
    2. Protect the `admin` route in `app.config.ts` with `canActivate: [authGuard]`.
  checks:
    redirects-when-logged-out: Logged out, `/admin` leads to `/login`
    admin-after-login: After **Log in**, `/admin` opens
    other-pages-open: The start page stays open to everyone
---

# Guards and resolvers

Not every page should be open to everyone, and some need data before they can show anything at all. For this, the router can run code before switching pages: **guards** decide *whether* to navigate, **resolvers** load *what* the page needs.

## A guard

A guard is a function. If it returns `true`, the navigation continues. If it returns a `UrlTree`, the router redirects there:

```ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (_route, state) => {
  if (inject(AuthService).loggedIn()) return true;
  return inject(Router).createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};
```

- Angular calls guards in an **injection context** – that's why `inject()` works.
- `state.url` is the URL the user wanted to open. If you pass it along as `returnUrl`, the login page can send the user back there afterwards.

You attach the guard to the route:

```ts
{ path: 'account', component: Account, canActivate: [authGuard] }
```

> [!WARNING]
> A guard only protects the **UI**. Anyone calling the API directly bypasses it. Real access rights must always be checked by the server.

## Other kinds of guards

| Guard | Asked … |
|---|---|
| `canActivate` | before a route is entered |
| `canActivateChild` | before one of its child routes is entered |
| `canDeactivate` | before a route is left – e.g. with unsaved changes |
| `canMatch` | whether a route may match at all (e.g. an admin version of a page) |

## A resolver

A resolver loads data **before** the route is activated. The page only appears once the data is there – no "loading …" state needed in the component:

```ts
export const profileResolver: ResolveFn<Profile> = () => inject(ProfileService).load();
```

```ts
{
  path: 'account',
  component: Account,
  canActivate: [authGuard],
  resolve: { profile: profileResolver },
}
```

With `withComponentInputBinding()`, the result arrives as an input – under the name used in `resolve`:

```ts
export class Account {
  readonly profile = input.required<Profile>();
}
```

::tryit{routing-guards}

> [!TIP]
> While a resolver loads, the **old** page stays on screen. If loading takes noticeably long, `resource()` in the component is often the better choice: the new page appears right away and shows its own loading state.

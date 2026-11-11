---
title: Routes and Navigation
minutes: 9
summary: |-
  - A route connects a `path` (no leading slash, `''` is the start page) with a `component`. `title` sets the tab title.
  - `redirectTo` redirects, `**` matches every URL. The router takes the first matching route, so `**` goes last.
  - You register the routes with `provideRouter(routes)` in `app.config.ts`.
  - `<router-outlet />` is the placeholder for the current route's component. Everything outside it stays in place.
  - `routerLink` instead of `href` switches pages without reloading, `routerLinkActive="active"` marks the active link.
  - The start-page link needs `[routerLinkActiveOptions]="{ exact: true }"`, otherwise it is always active.

  ```ts
  export const routes: Routes = [
    { path: '', component: Home, title: 'Home' },
    { path: 'team', redirectTo: 'about' },
    { path: '**', component: NotFound },
  ];
  ```
quiz:
  - question: Where does Angular display the component of the current route?
    options: ["In app.ts", "In the `<router-outlet>`", "In the `<body>`", "In an `@if` block"]
    answer: 1
  - question: "Why must `{ path: '**' }` be the last route?"
    options:
      - Because Angular throws an error otherwise
      - Because the router takes the first matching route – and `**` matches everything
      - Because `**` is only allowed at the end
      - It doesn't matter, the order is irrelevant
    answer: 1
  - question: Why `routerLink` instead of `href`?
    options:
      - href doesn't work in Angular at all
      - routerLink switches pages without reloading, so the app's state is kept
      - routerLink is just shorter
      - href is deprecated
    answer: 1
exercise:
  example: ex-routes
  title: A Menu with Navigation
  task: |-
    The app already has three page components – but no routes yet.

    1. In `app.routes.ts`, define the routes: `''` → `Home`, `'menu'` → `Menu`, `'food'` redirects to `'menu'`, `'**'` → `NotFound`.
    2. Turn the links in `app.ts` into router links. The link of the current page gets the class `active`. Show the current page with `<router-outlet>`.
    3. Import what the template needs from `@angular/router`.
  checks:
    home-route: The start page shows **Home**
    menu-link: The **Menu** link leads to `/menu`
    active-link: On `/menu`, only the Menu link has the class `active`
    redirect: "`/food` redirects to `/menu`"
    not-found: Unknown URLs show **Page not found**
---

# Routes and Navigation

So far every app consisted of a single page. Real applications have many: start page, product list, detail view, cart. The **Angular router** maps every URL to a component – without the browser reloading the page.

## Defining routes

A route connects a path with a component:

```ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', component: Home, title: 'Home' },
  { path: 'about', component: About, title: 'About us' },
  { path: 'team', redirectTo: 'about' },
  { path: '**', component: NotFound },
];
```

- `path` has **no** leading slash. `''` is the start page.
- `title` sets the title of the browser tab.
- `redirectTo` sends one URL to another – handy for old links.
- `**` matches **every** URL. The router takes the **first** matching route, so `**` goes last.

You register the routes in `app.config.ts`:

```ts
import { provideRouter } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)],
};
```

## Where the page appears: router-outlet

`<router-outlet />` is the placeholder where the router displays the component of the current route. Everything outside it – the navigation, for example – stays in place when the page changes:

```ts
@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <nav>
      <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Home</a>
      <a routerLink="/about" routerLinkActive="active">About</a>
    </nav>
    <router-outlet />
  `,
})
export class App {}
```

## Links: routerLink and routerLinkActive

- **`routerLink`** instead of `href`: the router switches pages without reloading. The app's state – a filled cart, for example – is kept.
- **`routerLinkActive="active"`** sets the class `active` while the link matches the current URL.
- The link to the start page needs `{ exact: true }`: without it, `/` would be active on *every* URL, because every URL starts with `/`.

::tryit{routing-basics}

> [!NOTE]
> If the router finds no route for a URL and there is no `**`, the navigation fails with the error `NG04002: Cannot match any routes`.

> [!TIP]
> Put the routes in a separate `app.routes.ts` file, just like the Angular CLI does. That keeps `app.config.ts` tidy.

---
title: Lazy loading and child routes
minutes: 8
quiz:
  - question: When is the code of a route with `loadComponent` loaded?
    options:
      - When the app starts
      - On the first visit to the route
      - Again on every visit
      - Only when a button is clicked
    answer: 1
  - question: What is the difference between `loadComponent` and `loadChildren`?
    options:
      - There is none
      - loadComponent loads one component, loadChildren a whole group of routes
      - loadChildren only works with modules
      - loadComponent is deprecated
    answer: 1
  - question: Where do the child routes of a route with `children` appear?
    options:
      - In the app's router-outlet
      - In the parent component's router-outlet
      - In a new window
      - Nowhere, you have to show them manually
    answer: 1
---

# Lazy loading and child routes

The more pages an app has, the bigger its JavaScript gets. Does a visitor to the start page really need to download the code of the admin area? With **lazy loading**, Angular loads a route's code only when it is visited for the first time.

## Loading a component later

Instead of `component`, use `loadComponent` with a dynamic `import()`:

```ts
const routes: Routes = [
  { path: '', component: Home }, // loaded with the app
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin').then((m) => m.Admin), // only on /admin
  },
];
```

The Angular CLI then puts `admin.ts` into a separate JavaScript file. It is loaded on the first visit to `/admin` – and not again afterwards.

> [!TIP]
> If the file exports its component as `export default`, `loadComponent: () => import('./admin/admin')` is enough.

## Whole areas with loadChildren

If an area has several pages, load its routes instead:

```ts
{ path: 'shop', loadChildren: () => import('./shop/shop.routes').then((m) => m.SHOP_ROUTES) }
```

```ts
// shop/shop.routes.ts – paths relative to /shop
export const SHOP_ROUTES: Routes = [
  {
    path: '',
    component: ShopLayout,
    children: [
      { path: '', component: ShopList },     // /shop
      { path: 'cart', component: ShopCart }, // /shop/cart
    ],
  },
];
```

## Child routes and nested outlets

With `children`, a route shows its sub-pages **inside itself**. The parent component – `ShopLayout` here – brings its own `<router-outlet>` for that:

```html
<h1>Shop</h1>
<nav>
  <a routerLink=".">Products</a>
  <a routerLink="cart">Cart</a>
</nav>
<router-outlet />  <!-- ShopList or ShopCart appears here -->
```

Links without a leading slash (`cart`, `.`) are **relative** to the current route – so the area keeps working if it later moves to a different path.

::tryit{routing-lazy}

> [!NOTE]
> Open the browser console in the example: on the first click on Admin or Shop a message says that the file was loaded – on the second click it doesn't appear again.

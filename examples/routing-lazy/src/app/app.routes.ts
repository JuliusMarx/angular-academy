import { Routes } from '@angular/router';
import { Home } from './home';

export const routes: Routes = [
  // Loaded with the app
  { path: '', component: Home },

  // One component, loaded only when /admin is visited
  { path: 'admin', loadComponent: () => import('./admin/admin').then((m) => m.Admin) },

  // A whole area with its own child routes, loaded only when /shop/… is visited
  { path: 'shop', loadChildren: () => import('./shop/shop.routes').then((m) => m.SHOP_ROUTES) },
];

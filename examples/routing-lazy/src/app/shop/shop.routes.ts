import { Routes } from '@angular/router';
import { ShopCart, ShopLayout, ShopList } from './shop';

console.log('📦 shop chunk loaded');

/** Child routes of /shop – the paths are relative to it. */
export const SHOP_ROUTES: Routes = [
  {
    path: '',
    component: ShopLayout,
    children: [
      { path: '', component: ShopList }, //   /shop
      { path: 'cart', component: ShopCart }, //   /shop/cart
    ],
  },
];

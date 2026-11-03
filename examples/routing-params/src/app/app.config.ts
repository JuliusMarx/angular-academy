import { ApplicationConfig } from '@angular/core';
import { provideRouter, Routes, withComponentInputBinding } from '@angular/router';
import { ProductDetail } from './product-detail';
import { ProductList } from './product-list';

const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: ProductList },
  // :id is a placeholder – /products/1, /products/2, …
  { path: 'products/:id', component: ProductDetail },
];

export const appConfig: ApplicationConfig = {
  // withComponentInputBinding(): route and query parameters arrive as component inputs
  providers: [provideRouter(routes, withComponentInputBinding())],
};

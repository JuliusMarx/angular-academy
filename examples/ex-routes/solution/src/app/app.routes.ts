import { Routes } from '@angular/router';
import { Home, Menu, NotFound } from './pages';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'menu', component: Menu },
  { path: 'food', redirectTo: 'menu' },
  { path: '**', component: NotFound },
];

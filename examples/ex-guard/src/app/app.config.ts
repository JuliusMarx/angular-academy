import { ApplicationConfig } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { Admin, Home, Login } from './pages';

const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  // TODO 2: protect this route with authGuard
  { path: 'admin', component: Admin },
];

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)],
};

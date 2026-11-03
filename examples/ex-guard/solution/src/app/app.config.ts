import { ApplicationConfig } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { authGuard } from './auth';
import { Admin, Home, Login } from './pages';

const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'admin', component: Admin, canActivate: [authGuard] },
];

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)],
};

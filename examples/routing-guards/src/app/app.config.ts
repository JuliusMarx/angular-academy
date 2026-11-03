import { ApplicationConfig } from '@angular/core';
import { provideRouter, Routes, withComponentInputBinding } from '@angular/router';
import { authGuard, profileResolver } from './auth';
import { Account, Home, Login } from './pages';

const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  {
    path: 'account',
    component: Account,
    canActivate: [authGuard], //            runs first – may redirect to /login
    resolve: { profile: profileResolver }, // then loads the data
  },
];

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes, withComponentInputBinding())],
};

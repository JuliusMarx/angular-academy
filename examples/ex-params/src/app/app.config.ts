import { ApplicationConfig } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { BookList } from './book-list';

const routes: Routes = [
  { path: '', redirectTo: 'books', pathMatch: 'full' },
  { path: 'books', component: BookList },
  // TODO 1: add a route 'books/:id' that shows BookDetail
];

export const appConfig: ApplicationConfig = {
  // TODO 2: make route parameters arrive as component inputs
  providers: [provideRouter(routes)],
};

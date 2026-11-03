import { Routes } from '@angular/router';
import { About, Contact, Home, NotFound } from './pages';

export const routes: Routes = [
  { path: '', component: Home, title: 'Home' },
  { path: 'about', component: About, title: 'About us' },
  { path: 'contact', component: Contact, title: 'Contact' },
  // Old URL that should keep working
  { path: 'team', redirectTo: 'about' },
  // Must come last: matches every URL nothing above matched
  { path: '**', component: NotFound, title: 'Not found' },
];

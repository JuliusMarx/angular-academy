import { ApplicationConfig } from '@angular/core';
import { provideRouter, Routes, withComponentInputBinding } from '@angular/router';
import { TaskList } from './task-list';

const routes: Routes = [
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  { path: 'tasks', component: TaskList, title: 'Tasks' },
  // The detail page is loaded lazily – only when someone opens a task.
  { path: 'tasks/:id', loadComponent: () => import('./task-detail').then((m) => m.TaskDetail), title: 'Task' },
  { path: '**', redirectTo: 'tasks' },
];

export const appConfig: ApplicationConfig = {
  // withComponentInputBinding(): the route parameter :id arrives as the input id
  providers: [provideRouter(routes, withComponentInputBinding())],
};

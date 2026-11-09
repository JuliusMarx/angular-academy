import { ApplicationConfig } from '@angular/core';
import { provideRouter, Routes, withComponentInputBinding } from '@angular/router';
import { TaskList } from './task-list';

const routes: Routes = [
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  { path: 'tasks', component: TaskList, title: 'Tasks' },
  // Before tasks/:id – otherwise :id would match "new".
  { path: 'tasks/new', loadComponent: () => import('./task-form').then((m) => m.TaskForm), title: 'New task' },
  { path: 'tasks/:id', loadComponent: () => import('./task-detail').then((m) => m.TaskDetail), title: 'Task' },
  { path: '**', redirectTo: 'tasks' },
];

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes, withComponentInputBinding())],
};

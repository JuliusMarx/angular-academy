import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideRouter, Routes, withComponentInputBinding } from '@angular/router';
import { fakeBackendInterceptor } from './fake-backend';
import { TaskList } from './task-list';

const routes: Routes = [
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  { path: 'tasks', component: TaskList, title: 'Tasks' },
  { path: 'tasks/new', loadComponent: () => import('./task-form').then((m) => m.TaskForm), title: 'New task' },
  { path: 'tasks/:id', loadComponent: () => import('./task-detail').then((m) => m.TaskDetail), title: 'Task' },
  { path: '**', redirectTo: 'tasks' },
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([fakeBackendInterceptor])),
  ],
};

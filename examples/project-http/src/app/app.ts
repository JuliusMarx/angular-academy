import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TaskStore } from './task-store';

/** The shell: navigation on top, the current page below. */
@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <header>
      <nav aria-label="Main">
        <a routerLink="/tasks" routerLinkActive="active" ariaCurrentWhenActive="page" [routerLinkActiveOptions]="{ exact: true }">
          Tasks
        </a>
        <a routerLink="/tasks/new" routerLinkActive="active" ariaCurrentWhenActive="page">New task</a>
      </nav>
      <p id="summary">{{ store.openCount() }} open</p>
    </header>
    <main>
      <router-outlet />
    </main>
  `,
  styles: `
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-block-end: 1px solid #ccc;
    }
    nav {
      display: flex;
      gap: 1rem;
    }
    .active {
      font-weight: bold;
    }
  `,
})
export class App {
  protected readonly store = inject(TaskStore);
}

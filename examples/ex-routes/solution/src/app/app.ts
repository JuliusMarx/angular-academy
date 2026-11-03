import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <nav>
      <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Home</a>
      <a routerLink="/menu" routerLinkActive="active">Menu</a>
    </nav>

    <router-outlet />
  `,
  styles: `
    nav {
      display: flex;
      gap: 1rem;
    }
    .active {
      font-weight: 700;
    }
  `,
})
export class App {}

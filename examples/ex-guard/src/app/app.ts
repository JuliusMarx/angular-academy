import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet],
  template: `
    <nav>
      <a routerLink="/">Home</a> ·
      <a routerLink="/admin">Admin</a>
    </nav>
    <router-outlet />
  `,
})
export class App {}

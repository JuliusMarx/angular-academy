import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <nav>
      <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Home</a>
      <a routerLink="/admin" routerLinkActive="active">Admin</a>
      <a routerLink="/shop" routerLinkActive="active">Shop</a>
    </nav>
    <router-outlet />
    <p class="url">URL: <code>{{ url() }}</code></p>
  `,
  styles: `
    nav {
      display: flex;
      gap: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #ddd;
    }
    .active {
      font-weight: 700;
      color: #c2185b;
    }
    .url {
      margin-top: 2rem;
      color: #666;
    }
  `,
})
export class App {
  private readonly router = inject(Router);
  protected readonly url = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
    ),
    { initialValue: '/' },
  );
}

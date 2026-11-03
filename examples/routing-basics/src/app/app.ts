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
      <a routerLink="/about" routerLinkActive="active">About</a>
      <a routerLink="/contact" routerLinkActive="active">Contact</a>
      <a routerLink="/team">Team (redirect)</a>
      <a routerLink="/does-not-exist">Broken link</a>
    </nav>

    <!-- The component of the current route is rendered here -->
    <router-outlet />

    <!-- The preview has no address bar, so show the URL here -->
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

import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { AuthService } from './auth';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet],
  template: `
    <nav>
      <a routerLink="/">Home</a>
      <a routerLink="/account">Account</a>
      <span>{{ auth.loggedIn() ? 'Logged in' : 'Logged out' }}</span>
      @if (auth.loggedIn()) {
        <button type="button" (click)="logout()">Log out</button>
      }
    </nav>
    <router-outlet />
    <p class="url">URL: <code>{{ url() }}</code></p>
  `,
  styles: `
    nav {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #ddd;
    }
    .url {
      margin-top: 2rem;
      color: #666;
    }
  `,
})
export class App {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly url = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
    ),
    { initialValue: '/' },
  );

  protected logout(): void {
    this.auth.loggedIn.set(false);
    void this.router.navigate(['/']);
  }
}

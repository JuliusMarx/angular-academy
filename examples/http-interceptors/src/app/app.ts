import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { catchError, EMPTY, retry } from 'rxjs';
import { RequestLog } from './request-log';

interface News {
  id: number;
  title: string;
}

@Component({
  selector: 'app-root',
  template: `
    <h1>Interceptors</h1>

    <button type="button" (click)="loadMe()">Load profile</button>
    <button type="button" (click)="loadNews()">Load news</button>
    <button type="button" (click)="loadMissing()">Load a missing file</button>

    @if (me(); as user) {
      <p>Signed in as {{ user.name }} ({{ user.role }})</p>
    }
    @for (item of news(); track item.id) {
      <p>📰 {{ item.title }}</p>
    }
    @if (error()) {
      <p class="error" role="alert">{{ error() }}</p>
    }

    <h2>Request log</h2>
    <ol>
      @for (entry of log.entries(); track $index) {
        <li>{{ entry }}</li>
      }
    </ol>
  `,
  styles: `
    .error {
      color: #b3261e;
    }
  `,
})
export class App {
  private readonly http = inject(HttpClient);
  protected readonly log = inject(RequestLog);

  protected readonly me = signal<{ name: string; role: string } | null>(null);
  protected readonly news = signal<News[]>([]);
  protected readonly error = signal('');

  protected loadMe(): void {
    this.http.get<{ name: string; role: string }>('/api/me').subscribe((user) => this.me.set(user));
  }

  protected loadNews(): void {
    this.http.get<News[]>('/api/news.json').subscribe((news) => this.news.set(news));
  }

  protected loadMissing(): void {
    this.error.set('');
    this.http
      .get<News[]>('/api/missing.json')
      .pipe(
        retry(1), // try once more before giving up
        catchError((err: HttpErrorResponse) => {
          this.error.set(err.status === 404 ? 'Not found (404).' : `Request failed with status ${err.status}.`);
          return EMPTY;
        }),
      )
      .subscribe();
  }
}

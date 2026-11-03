import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { ErrorBanner } from './error-banner';

@Component({
  selector: 'app-root',
  template: `
    <p id="banner" role="alert">{{ banner.message() }}</p>
    <h1>Account</h1>

    <button type="button" (click)="loadProfile()">Load profile</button>
    <button type="button" (click)="sendAnalytics()">Send analytics</button>
    <button type="button" (click)="loadMissing()">Load missing file</button>

    <p id="profile">{{ profile() }}</p>
    <p id="analytics">{{ analytics() }}</p>
  `,
  styles: `
    #banner:not(:empty) {
      padding: 0.5rem;
      background: #fde7e6;
      color: #8c1d18;
    }
  `,
})
export class App {
  private readonly http = inject(HttpClient);
  protected readonly banner = inject(ErrorBanner);

  protected readonly profile = signal('');
  protected readonly analytics = signal('');

  protected loadProfile(): void {
    this.http.get<{ name: string }>('/api/me').subscribe({
      next: (me) => this.profile.set(`Signed in as ${me.name}`),
      error: (e: HttpErrorResponse) => this.profile.set(`Not signed in (${e.status})`),
    });
  }

  protected sendAnalytics(): void {
    this.http.post('https://analytics.example.com/events', { event: 'click' }).subscribe({
      next: () => this.analytics.set('Analytics sent'),
      error: (e: HttpErrorResponse) => this.analytics.set(`Rejected: ${e.statusText}`),
    });
  }

  protected loadMissing(): void {
    this.http.get('/api/missing.json').subscribe({ error: () => {} });
  }
}

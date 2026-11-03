import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RequestLog {
  readonly entries = signal<string[]>([]);

  add(entry: string): void {
    this.entries.update((list) => [...list, entry]);
  }
}

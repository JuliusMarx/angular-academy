import { computed, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly names = signal<string[]>([]);
  readonly count = computed(() => this.names().length);

  toggle(name: string): void {
    this.names.update((names) => (names.includes(name) ? names.filter((n) => n !== name) : [...names, name]));
  }

  isFavorite(name: string): boolean {
    return this.names().includes(name);
  }
}

import { DOCUMENT } from '@angular/common';
import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { Lang } from '../content/content.model';
import { UI_TEXT } from '../core/ui-text';
import { Header } from './header';
import { Sidebar } from './sidebar';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, Header, Sidebar],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export default class Shell {
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);

  readonly lang = input.required<Lang>();
  protected readonly text = computed(() => UI_TEXT[this.lang()]);
  protected readonly menuOpen = signal(false);

  protected readonly url = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => this.router.url),
    ),
    { initialValue: this.router.url },
  );

  constructor() {
    effect(() => {
      this.document.documentElement.lang = this.lang();
    });
    // Close the mobile menu whenever the user navigates.
    effect(() => {
      this.url();
      this.menuOpen.set(false);
    });
  }
}

import { Component } from '@angular/core';

@Component({
  selector: 'app-user-badge',
  template: `<span class="badge">Angular Fan</span>`,
  styles: `
    .badge {
      padding: 0.1rem 0.5rem;
      border-radius: 1rem;
      background: #fce4ee;
      color: #a3134c;
    }
  `,
})
export class UserBadge {}

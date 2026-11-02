import { Component } from '@angular/core';
import { UserBadge } from './user-badge';

@Component({
  selector: 'app-root',
  imports: [UserBadge],
  template: `
    <h1>Team</h1>

    <p>Ada</p>
    <app-user-badge />

    <p>Alan</p>
    <app-user-badge />
  `,
})
export class App {}

import { Component } from '@angular/core';
import { Alert } from './alert';

@Component({
  selector: 'app-root',
  imports: [Alert],
  template: `
    <h1>Alerts</h1>

    <app-alert>
      <span alert-title>Heads up!</span>
      Your changes are saved automatically.
    </app-alert>

    <app-alert>
      This alert has no title of its own.
    </app-alert>
  `,
})
export class App {}

import { Component } from '@angular/core';

@Component({
  selector: 'app-alert',
  template: `
    <div class="alert" role="note">
      <div class="title">
        <ng-content select="[alert-title]">Note</ng-content>
      </div>
      <div class="body">
        <ng-content />
      </div>
    </div>
  `,
  styles: `
    .alert {
      margin-bottom: 1rem;
      padding: 0.75rem 1rem;
      border-left: 4px solid #c2185b;
      background: #fce4ee;
    }
    .title {
      font-weight: 700;
    }
  `,
})
export class Alert {}

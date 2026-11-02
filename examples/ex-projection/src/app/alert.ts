import { Component } from '@angular/core';

@Component({
  selector: 'app-alert',
  template: `
    <div class="alert" role="note">
      <div class="title">
        <!-- TODO 1: project elements with the attribute "alert-title" here.
             If there is none, show the fallback text "Note". -->
      </div>
      <div class="body">
        <!-- TODO 2: project everything else here -->
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

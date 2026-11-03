import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  // TODO 3: import what the template needs from '@angular/router'
  template: `
    <nav>
      <!-- TODO 2: turn these into router links. The link of the current page gets the class "active". -->
      <a>Home</a>
      <a>Menu</a>
    </nav>

    <!-- TODO 2: show the current page here -->
  `,
  styles: `
    nav {
      display: flex;
      gap: 1rem;
    }
    .active {
      font-weight: 700;
    }
  `,
})
export class App {}

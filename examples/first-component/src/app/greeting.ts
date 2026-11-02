import { Component } from '@angular/core';

@Component({
  selector: 'app-greeting',
  template: `<p class="greeting">Hello from the greeting component! 👋</p>`,
  styles: `
    .greeting {
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      background: #fce4ee;
      color: #a3134c;
    }
  `,
})
export class Greeting {}

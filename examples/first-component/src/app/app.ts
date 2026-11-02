import { Component } from '@angular/core';
import { Greeting } from './greeting';

@Component({
  selector: 'app-root',
  imports: [Greeting],
  template: `
    <h1>My first Angular app</h1>
    <app-greeting />
    <!-- Try it: add a second <app-greeting /> here -->
  `,
})
export class App {}

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  template: `<h1>Home</h1><p>Welcome to the shop.</p>`,
})
export class Home {}

@Component({
  selector: 'app-about',
  template: `<h1>About</h1><p>We sell mugs, shirts and stickers.</p>`,
})
export class About {}

@Component({
  selector: 'app-contact',
  template: `<h1>Contact</h1><p>Write to hello&#64;example.com.</p>`,
})
export class Contact {}

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `<h1>Page not found</h1><p><a routerLink="/">Back to the start page</a></p>`,
})
export class NotFound {}

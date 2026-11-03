import { Component } from '@angular/core';

@Component({ selector: 'app-home', template: `<h1>Home</h1>` })
export class Home {}

@Component({ selector: 'app-menu', template: `<h1>Menu</h1><p>Pizza · Pasta · Salad</p>` })
export class Menu {}

@Component({ selector: 'app-not-found', template: `<h1>Page not found</h1>` })
export class NotFound {}

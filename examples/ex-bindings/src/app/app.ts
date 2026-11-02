import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <!-- TODO 1: show the name from the signal: "Hello, <name>!" -->
    <h1>Hello, stranger!</h1>

    <!-- TODO 2: bind the input to the name signal ([value] and (input)) -->
    <input id="name" placeholder="Your name" />

    <!-- TODO 3: clear the name on click, and disable the button while the name is empty -->
    <button type="button" id="clear">Clear</button>
  `,
})
export class App {
  protected readonly name = signal('');
}

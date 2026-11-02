import { Component, signal } from '@angular/core';
import { Highlight } from './highlight';

@Component({
  selector: 'app-root',
  imports: [Highlight],
  template: `
    <h1>Attribute directives</h1>

    <p appHighlight>Hover me – default color.</p>
    <p appHighlight="lightblue">Hover me – fixed color.</p>
    <p [appHighlight]="color()">Hover me – color from a signal: {{ color() }}</p>

    <p>
      @for (c of colors; track c) {
        <button type="button" appHighlight="#fce4ee" (click)="color.set(c)">{{ c }}</button>
      }
    </p>

    <!-- Try it: add an input "delay" to the directive and only highlight after it -->
  `,
})
export class App {
  protected readonly colors = ['orange', 'lightgreen', 'violet'];
  protected readonly color = signal('orange');
}

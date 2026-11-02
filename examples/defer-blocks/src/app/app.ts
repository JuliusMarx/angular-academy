import { Component } from '@angular/core';
import { HeavyChart } from './heavy-chart';

@Component({
  selector: 'app-root',
  imports: [HeavyChart],
  template: `
    <h1>&#64;defer demo</h1>
    <p>Open the browser's network tab: the chart code is only loaded when you click the button.</p>

    @defer (on interaction) {
      <app-heavy-chart />
    } @placeholder {
      <button type="button">Show chart</button>
    } @loading (minimum 500ms) {
      <p>Loading chart …</p>
    }

    <div style="height: 120vh"></div>

    @defer (on viewport) {
      <p>👋 I was loaded when you scrolled down here.</p>
    } @placeholder {
      <p>Scroll down …</p>
    }
  `,
})
export class App {}

import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  // TODO: import ExternalLink and put the attribute appExternalLink on the two external links
  template: `
    <h1>Links</h1>
    <ul>
      <li><a id="docs" href="https://angular.dev">Angular docs</a></li>
      <li><a id="mdn" href="https://developer.mozilla.org">MDN</a></li>
      <li><a id="home" href="/">Home (internal – leave as it is)</a></li>
    </ul>
  `,
  styles: `
    .external::after {
      content: ' ↗';
    }
  `,
})
export class App {}

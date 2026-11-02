import { Component } from '@angular/core';
import { ExternalLink } from './external-link';

@Component({
  selector: 'app-root',
  imports: [ExternalLink],
  template: `
    <h1>Links</h1>
    <ul>
      <li><a id="docs" href="https://angular.dev" appExternalLink>Angular docs</a></li>
      <li><a id="mdn" href="https://developer.mozilla.org" appExternalLink>MDN</a></li>
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

import { Component } from '@angular/core';
import { OwnCounter, SharedCounter } from './counters';

@Component({
  selector: 'app-root',
  imports: [OwnCounter, SharedCounter],
  template: `
    <h1>Injector hierarchy</h1>

    <h2>Shared (root injector)</h2>
    <app-shared-counter />
    <app-shared-counter />

    <h2>Own instance per component (component providers)</h2>
    <app-own-counter />
    <app-own-counter />

    <!-- Try it: remove providers: [CounterService] from OwnCounter and click again -->
  `,
})
export class App {}

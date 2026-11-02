import { Component, inject } from '@angular/core';
import { CounterService } from './counter.service';

/** Shows which CounterService instance it receives from the injector tree above it. */
@Component({
  selector: 'app-counter-display',
  template: `<p class="child">↳ Child sees instance #{{ counter.instanceId }}: {{ counter.count() }}</p>`,
})
export class CounterDisplay {
  protected readonly counter = inject(CounterService);
}

/** No providers – injects the app-wide instance from the root injector. */
@Component({
  selector: 'app-shared-counter',
  template: `
    <p class="counter">
      Shared counter (instance #{{ counter.instanceId }}): {{ counter.count() }}
      <button type="button" (click)="counter.increment()">+</button>
    </p>
  `,
})
export class SharedCounter {
  protected readonly counter = inject(CounterService);
}

/** providers: [CounterService] – every <app-own-counter> gets its own instance. */
@Component({
  selector: 'app-own-counter',
  imports: [CounterDisplay],
  providers: [CounterService],
  template: `
    <div class="box">
      <p class="counter">
        Own counter (instance #{{ counter.instanceId }}): {{ counter.count() }}
        <button type="button" (click)="counter.increment()">+</button>
      </p>
      <!-- Children see the instance of the nearest provider above them. -->
      <app-counter-display />
    </div>
  `,
  styles: `
    .box {
      margin: 0.5rem 0;
      padding: 0.25rem 1rem;
      border: 1px dashed #c2185b;
    }
  `,
})
export class OwnCounter {
  protected readonly counter = inject(CounterService);
}

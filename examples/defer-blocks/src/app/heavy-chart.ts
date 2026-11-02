import { Component } from '@angular/core';

/** Pretend this component is large – @defer moves it into a separate chunk. */
@Component({
  selector: 'app-heavy-chart',
  template: `
    <div class="chart">
      @for (value of values; track $index) {
        <div class="bar" [style.height.%]="value"></div>
      }
    </div>
  `,
  styles: `
    .chart {
      display: flex;
      align-items: flex-end;
      gap: 6px;
      height: 150px;
      padding: 8px;
      border: 1px solid #ccc;
    }
    .bar {
      flex: 1;
      background: #c2185b;
    }
  `,
})
export class HeavyChart {
  protected readonly values = [30, 80, 55, 95, 40, 70, 20];
}

import {
  AsyncPipe,
  CurrencyPipe,
  DatePipe,
  DecimalPipe,
  JsonPipe,
  KeyValuePipe,
  PercentPipe,
  registerLocaleData,
  UpperCasePipe,
} from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { Component } from '@angular/core';
import { interval, map } from 'rxjs';

// Locale data for German formatting (the app's default locale is en-US).
registerLocaleData(localeDe);

@Component({
  selector: 'app-root',
  imports: [AsyncPipe, CurrencyPipe, DatePipe, DecimalPipe, JsonPipe, KeyValuePipe, PercentPipe, UpperCasePipe],
  template: `
    <h1>Order {{ order.id | uppercase }}</h1>

    <table>
      <tr><th></th><th>default (en-US)</th><th>with 'de' locale</th></tr>
      <tr>
        <td>date</td>
        <td>{{ order.date | date: 'medium' }}</td>
        <td>{{ order.date | date: 'medium' : undefined : 'de' }}</td>
      </tr>
      <tr>
        <td>currency</td>
        <td>{{ order.total | currency: 'EUR' }}</td>
        <td>{{ order.total | currency: 'EUR' : 'symbol' : undefined : 'de' }}</td>
      </tr>
      <tr>
        <td>number</td>
        <td>{{ order.weightKg | number: '1.1-2' }} kg</td>
        <td>{{ order.weightKg | number: '1.1-2' : 'de' }} kg</td>
      </tr>
      <tr>
        <td>percent</td>
        <td>{{ order.discount | percent }}</td>
        <td>{{ order.discount | percent: undefined : 'de' }}</td>
      </tr>
    </table>

    <h2>Custom date formats</h2>
    <p>{{ order.date | date: 'dd.MM.yyyy' }} · {{ order.date | date: 'EEEE, d. MMMM' : undefined : 'de' }}</p>

    <h2>async – subscribes for you</h2>
    <p>Seconds on this page: {{ seconds$ | async }}</p>

    <h2>keyvalue and json – for debugging</h2>
    <ul>
      @for (entry of order.address | keyvalue; track entry.key) {
        <li>{{ entry.key }}: {{ entry.value }}</li>
      }
    </ul>
    <pre>{{ order.address | json }}</pre>

    <!-- Try it: show the total with two decimals but without the currency symbol -->
  `,
  styles: `
    table {
      border-collapse: collapse;
    }
    td,
    th {
      padding: 0.3rem 0.8rem;
      border: 1px solid #ddd;
      text-align: left;
    }
  `,
})
export class App {
  protected readonly order = {
    id: 'ab-1042',
    date: new Date(2026, 10, 2, 14, 30),
    total: 1234.5,
    weightKg: 2.456,
    discount: 0.15,
    address: { street: 'Main St 1', city: 'Berlin', zip: '10115' },
  };

  protected readonly seconds$ = interval(1000).pipe(map((n) => n + 1));
}

---
title: Formatting values with built-in pipes
minutes: 9
quiz:
  - question: "What does {{ 1234.5 | currency: 'EUR' }} output with the default locale en-US?"
    options: ["1.234,50 €", "€1,234.50", "EUR 1234.5", "1234,50 EUR"]
    answer: 1
  - question: What do you have to do before you can use pipes with the locale 'de'?
    options:
      - Nothing, all languages are built in
      - Call registerLocaleData() with the German locale data
      - Set the browser language to German
      - Write a custom pipe
    answer: 1
  - question: What does the async pipe do for you?
    options:
      - It makes synchronous values asynchronous
      - It subscribes to an observable or promise and unsubscribes automatically
      - It loads data from the server
      - It delays the display by one second
    answer: 1
---

# Formatting values with built-in pipes

Data rarely comes in the shape people want to read: a date is a `Date` object, a price a number like `1234.5`. **Pipes** turn values into a readable form right in the template – with the `|` character.

```html
<p>{{ order.total | currency: 'EUR' }}</p>  <!-- €1,234.50 -->
```

## Importing and using pipes

Like components, pipes are standalone. You import the ones you need:

```ts
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  imports: [CurrencyPipe, DatePipe],
  template: `{{ order.date | date: 'medium' }}`,
})
export class Order {}
```

Add parameters with colons: `{{ value | pipe: param1 : param2 }}`.

## The most important pipes

| Pipe | Example | Output (en-US) |
|---|---|---|
| `date` | `date: 'medium'` | Nov 2, 2026, 2:30:00 PM |
| `date` | `date: 'dd.MM.yyyy'` | 02.11.2026 |
| `currency` | `currency: 'EUR'` | €1,234.50 |
| `number` | `number: '1.1-2'` | 2.46 |
| `percent` | `percent` | 15% |
| `uppercase` / `lowercase` | `uppercase` | AB-1042 |
| `json` | `json` | `{ "city": "Berlin", … }` |
| `keyvalue` | in `@for` | key-value pairs of an object |
| `async` | `seconds$ \| async` | latest value of an observable |

The format `'1.1-2'` for `number` means: at least **1** digit before the decimal point, at least **1** and at most **2** decimal places.

## German formats: locales

By default Angular formats for US English. For German formats, register the locale data once …

```ts
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';

registerLocaleData(localeDe);
```

… and pass the locale as the last parameter:

```html
{{ order.total | currency: 'EUR' : 'symbol' : undefined : 'de' }}  <!-- 1.234,50 € -->
{{ order.date | date: 'EEEE, d. MMMM' : undefined : 'de' }}       <!-- Montag, 2. November -->
```

> [!TIP]
> If the whole app should use German formats, set the provider `{ provide: LOCALE_ID, useValue: 'de' }` once in the app configuration instead. Then you don't need the locale parameter anymore.

## async: observables in the template

The `async` pipe subscribes to an observable or promise, shows the latest value and unsubscribes automatically when the component goes away:

```ts
protected readonly seconds$ = interval(1000).pipe(map((n) => n + 1));
```

```html
<p>Seconds on this page: {{ seconds$ | async }}</p>
```

::tryit{builtin-pipes}

> [!NOTE]
> `keyvalue` sorts the keys **alphabetically** – in the example `city` comes before `street`, even though `street` comes first in the object. `json`, on the other hand, keeps the original order. `json` is mainly meant for debugging.

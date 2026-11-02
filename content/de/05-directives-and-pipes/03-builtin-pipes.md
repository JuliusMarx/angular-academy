---
title: Werte formatieren mit eingebauten Pipes
minutes: 9
quiz:
  - question: "Was gibt {{ 1234.5 | currency: 'EUR' }} mit der Standard-Locale en-US aus?"
    options: ["1.234,50 €", "€1,234.50", "EUR 1234.5", "1234,50 EUR"]
    answer: 1
  - question: Was musst du tun, bevor du Pipes mit der Locale 'de' verwenden kannst?
    options:
      - Nichts, alle Sprachen sind eingebaut
      - registerLocaleData() mit den deutschen Locale-Daten aufrufen
      - Die Browsersprache auf Deutsch stellen
      - Ein eigenes Pipe schreiben
    answer: 1
  - question: Was erledigt die async-Pipe für dich?
    options:
      - Sie macht synchrone Werte asynchron
      - Sie abonniert ein Observable oder Promise und beendet das Abo automatisch
      - Sie lädt Daten vom Server
      - Sie verzögert die Anzeige um eine Sekunde
    answer: 1
---

# Werte formatieren mit eingebauten Pipes

Daten liegen selten so vor, wie Menschen sie lesen wollen: Ein Datum ist ein `Date`-Objekt, ein Preis eine Zahl wie `1234.5`. **Pipes** wandeln Werte direkt im Template in eine lesbare Form um – mit dem Zeichen `|`.

```html
<p>{{ order.total | currency: 'EUR' }}</p>  <!-- €1,234.50 -->
```

## Pipes importieren und verwenden

Pipes sind wie Komponenten standalone. Du importierst die, die du brauchst:

```ts
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  imports: [CurrencyPipe, DatePipe],
  template: `{{ order.date | date: 'medium' }}`,
})
export class Order {}
```

Parameter hängst du mit Doppelpunkten an: `{{ wert | pipe: param1 : param2 }}`.

## Die wichtigsten Pipes

| Pipe | Beispiel | Ausgabe (en-US) |
|---|---|---|
| `date` | `date: 'medium'` | Nov 2, 2026, 2:30:00 PM |
| `date` | `date: 'dd.MM.yyyy'` | 02.11.2026 |
| `currency` | `currency: 'EUR'` | €1,234.50 |
| `number` | `number: '1.1-2'` | 2.46 |
| `percent` | `percent` | 15% |
| `uppercase` / `lowercase` | `uppercase` | AB-1042 |
| `json` | `json` | `{ "city": "Berlin", … }` |
| `keyvalue` | in `@for` | Schlüssel-Wert-Paare eines Objekts |
| `async` | `seconds$ \| async` | aktueller Wert eines Observables |

Das Format `'1.1-2'` bei `number` bedeutet: mindestens **1** Stelle vor dem Komma, mindestens **1** und höchstens **2** Nachkommastellen.

## Deutsche Formate: Locales

Standardmäßig formatiert Angular nach US-Englisch. Für deutsche Formate registrierst du die Locale-Daten einmal …

```ts
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';

registerLocaleData(localeDe);
```

… und gibst die Locale als letzten Parameter an:

```html
{{ order.total | currency: 'EUR' : 'symbol' : undefined : 'de' }}  <!-- 1.234,50 € -->
{{ order.date | date: 'EEEE, d. MMMM' : undefined : 'de' }}       <!-- Montag, 2. November -->
```

> [!TIP]
> Soll die ganze App Deutsch formatieren, setze stattdessen einmal den Provider `{ provide: LOCALE_ID, useValue: 'de' }` in der App-Konfiguration. Dann brauchst du den Locale-Parameter nicht mehr.

## async: Observables im Template

Die `async`-Pipe abonniert ein Observable oder Promise, zeigt den jeweils neuesten Wert an und beendet das Abo automatisch, wenn die Komponente verschwindet:

```ts
protected readonly seconds$ = interval(1000).pipe(map((n) => n + 1));
```

```html
<p>Sekunden auf dieser Seite: {{ seconds$ | async }}</p>
```

::tryit{builtin-pipes}

> [!NOTE]
> `keyvalue` sortiert die Schlüssel **alphabetisch** – im Beispiel erscheint `city` vor `street`, obwohl `street` im Objekt zuerst steht. `json` behält dagegen die Original-Reihenfolge. `json` ist vor allem zum Debuggen gedacht.

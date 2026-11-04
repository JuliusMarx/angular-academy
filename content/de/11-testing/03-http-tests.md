---
title: HTTP testen
minutes: 8
summary: |-
  - Im Test brauchst du keinen echten Server: `provideHttpClientTesting()` fängt jede Anfrage ab. Es muss **nach** `provideHttpClient()` stehen.
  - Über den `HttpTestingController` erwartest und beantwortest du Anfragen.
  - `expectOne(url)` schlägt fehl, wenn es nicht genau eine passende Anfrage gibt. Für Parameter übergibst du eine Funktion.
  - `req.flush(daten)` liefert die Antwort, `req.request` zeigt Methode, Body, Header und Parameter.
  - Serverfehler simulierst du mit `flush('…', { status: 500, statusText: '…' })`.
  - `http.verify()` in `afterEach` lässt den Test fehlschlagen, wenn eine unerwartete Anfrage offen geblieben ist.

  ```ts
  service.names().subscribe((n) => (names = n));

  const req = http.expectOne('/api/users');
  expect(req.request.method).toBe('GET');
  req.flush([{ id: 1, name: 'Grace' }, { id: 2, name: 'Ada' }]);

  expect(names).toEqual(['Ada', 'Grace']);
  ```
quiz:
  - question: "Was macht `provideHttpClientTesting()`?"
    options:
      - Es sendet die Anfragen an einen Testserver
      - Es fängt alle Anfragen ab, damit der Test sie selbst beantworten kann
      - Es schaltet HTTP im Test ab
      - Es speichert echte Antworten zwischen
    answer: 1
  - question: "Was prüft `http.verify()` im `afterEach`?"
    options:
      - Ob alle Antworten gültiges JSON waren
      - Ob keine unerwartete Anfrage offen geblieben ist
      - Ob der Server erreichbar ist
      - Ob die Tests schnell genug waren
    answer: 1
  - question: Wie testest du, dass dein Service mit einem Serverfehler umgehen kann?
    options:
      - Den echten Server abschalten
      - "`req.flush(body, { status: 500, statusText: '…' })`"
      - Das ist nicht testbar
      - "`expect(http).toThrow()`"
    answer: 1
exercise:
  example: ex-test-http
  title: Tests für einen Wetterdienst
  task: |-
    Schreibe in `weather.spec.ts` Tests für den Service `Weather`:

    1. `forecast('Berlin')` schickt `GET /api/weather` mit dem Parameter `city=Berlin`.
    2. Auf die Antwort `{ city: 'Berlin', temperature: 11.6 }` liefert er „12 °C“.
    3. Bei Status 404 liefert er „Unknown city“.
  checks:
    tests-pass: Deine Tests laufen gegen den echten Service durch
    catches-param-bug: Ein Test bemerkt einen falschen Parameternamen
    catches-rounding-bug: Ein Test bemerkt, wenn nicht gerundet wird
    catches-error-bug: Ein Test bemerkt, wenn Fehler nicht abgefangen werden
---

# HTTP testen

Services, die Daten laden, sollen im Test **keinen echten Server** brauchen. Der wäre langsam, könnte ausfallen, und seine Daten ändern sich. Angular bringt dafür ein Test-Backend mit: Es fängt jede Anfrage ab, und dein Test entscheidet, was der „Server“ antwortet.

## Das Test-Backend einrichten

```ts
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [provideHttpClient(), provideHttpClientTesting()],
  });
  service = TestBed.inject(UserService);
  http = TestBed.inject(HttpTestingController);
});

afterEach(() => {
  http.verify();
});
```

`provideHttpClientTesting()` muss **nach** `provideHttpClient()` stehen. Mit `http.verify()` schlägt der Test fehl, wenn eine Anfrage offen geblieben ist, die er nicht erwartet hat.

## Eine Anfrage erwarten und beantworten

Der Ablauf ist immer gleich: Methode aufrufen, Anfrage erwarten, Antwort liefern, Ergebnis prüfen.

```ts
it('loads and sorts the names', () => {
  let names: string[] = [];
  service.names().subscribe((n) => (names = n));

  const req = http.expectOne('/api/users');
  expect(req.request.method).toBe('GET');
  req.flush([{ id: 1, name: 'Grace' }, { id: 2, name: 'Ada' }]);

  expect(names).toEqual(['Ada', 'Grace']);
});
```

- `expectOne(url)` schlägt fehl, wenn es nicht genau **eine** passende Anfrage gibt.
- `req.request` zeigt dir Methode, Body, Header und Parameter.
- `req.flush(daten)` beantwortet die Anfrage. Danach läuft der Code im `subscribe` sofort.

Für Parameter übergibst du eine Funktion statt einer URL:

```ts
http.expectOne((req) => req.url === '/api/weather' && req.params.get('city') === 'Berlin');
```

## Fehler simulieren

Mit Status und Text in `flush` spielst du einen Serverfehler nach, ganz ohne kaputten Server:

```ts
http.expectOne('/api/users').flush('Server error', { status: 500, statusText: 'Internal Server Error' });
expect(names).toEqual([]);
```

::tryit{testing-http}

> [!TIP]
> Teste die Fälle, die im Betrieb selten vorkommen: 404, 500, leere Listen. Im Browser kommst du an diese Fälle kaum heran, im Test sind sie eine Zeile.

## Was du jetzt testen kannst

| Was | Werkzeug |
|---|---|
| Funktionen und Services | `TestBed.inject()`, `expect()` |
| Abhängigkeiten ersetzen | `providers: [{ provide, useValue }]`, `vi.fn()` |
| Komponenten | `TestBed.createComponent()`, `whenStable()`, `setInput()` |
| HTTP | `provideHttpClientTesting()`, `HttpTestingController` |

Für Abläufe über mehrere Seiten, etwa „Anmelden, Produkt in den Warenkorb, Bestellen“, gibt es **End-to-End-Tests** mit Werkzeugen wie Playwright. Sie steuern einen echten Browser und ergänzen Unit-Tests. Ersetzen können sie sie nicht, denn sie sind deutlich langsamer.

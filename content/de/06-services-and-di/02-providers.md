---
title: Provider und Injection Tokens
minutes: 10
quiz:
  - question: "Was bewirkt `{ provide: Logger, useClass: MemoryLogger }`?"
    options:
      - Wer Logger anfordert, bekommt eine Instanz von MemoryLogger
      - MemoryLogger wird in Logger umbenannt
      - Beide Klassen werden zusammengeführt
      - Logger wird nur geladen, wenn MemoryLogger fehlt
    answer: 0
  - question: Wofür braucht man ein InjectionToken?
    options:
      - Für Klassen mit vielen Methoden
      - Für Werte ohne eigene Klasse, etwa Strings oder Konfigurationsobjekte
      - Nur für HTTP-Anfragen
      - Um Services schneller zu machen
    answer: 1
  - question: "Was liefert `inject(X, { optional: true })`, wenn niemand X bereitstellt?"
    options: ["`undefined`", "`null`", "Einen Fehler", "Eine leere Instanz"]
    answer: 1
exercise:
  example: ex-providers
  title: Logger und App-Name bereitstellen
  task: |-
    Die App fordert einen `Logger` und das Token `APP_NAME` an – aber niemand stellt sie bereit. Deshalb startet sie mit dem Fehler `NG0201`.

    Ergänze in `app.config.ts`:

    1. Wer `Logger` anfordert, bekommt einen `MemoryLogger` (`useClass`).
    2. Das Token `APP_NAME` hat den Wert `My Shop` (`useValue`).
  checks:
    app-starts: Die App startet ohne Fehler
    app-name: Die Überschrift zeigt **My Shop**
    memory-logger: Nach **Save** steht **Saved** im Log
---

# Provider und Injection Tokens

Mit `providedIn: 'root'` stellt sich ein Service selbst bereit. Oft willst du aber selbst bestimmen, **was** eine Komponente bekommt: eine andere Implementierung im Test, eine Konfiguration pro Umgebung, einen Wert ohne eigene Klasse. Dafür gibt es **Provider**.

## Wer fragt, bekommt …

Ein Provider ist eine Regel: „Wer *X* anfordert, bekommt *Y*.“ Du trägst Provider in `app.config.ts` ein:

```ts
import { ApplicationConfig } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: Logger, useClass: MemoryLogger },
  ],
};
```

Die Komponente fragt nur nach dem Vertrag – welche Implementierung sie bekommt, entscheidet die Konfiguration:

```ts
export abstract class Logger {
  abstract log(message: string): void;
}

export class App {
  private readonly logger = inject(Logger); // bekommt einen MemoryLogger
}
```

## Die Provider-Arten

| Provider | Bedeutung |
|---|---|
| `{ provide: X, useClass: Y }` | erzeugt eine Instanz von `Y` |
| `{ provide: X, useValue: wert }` | gibt genau diesen Wert heraus |
| `{ provide: X, useFactory: () => … }` | ruft die Funktion auf und gibt ihr Ergebnis heraus |
| `{ provide: X, useExisting: Y }` | leitet auf einen anderen Provider um – gleiche Instanz |
| `Y` | Kurzform für `{ provide: Y, useClass: Y }` |

## Injection Tokens für Werte

Für einen String oder ein Konfigurationsobjekt gibt es keine Klasse, nach der man fragen könnte. Dafür legst du ein **`InjectionToken`** als Schlüssel an:

```ts
import { InjectionToken } from '@angular/core';

export interface AppSettings {
  appName: string;
  maxItems: number;
}

export const APP_SETTINGS = new InjectionToken<AppSettings>('APP_SETTINGS', {
  providedIn: 'root',
  factory: () => ({ appName: 'Standard-App', maxItems: 3 }),
});
```

- Die `factory` liefert einen Standardwert – das Token funktioniert also auch ohne Provider.
- In `app.config.ts` überschreibst du ihn mit `{ provide: APP_SETTINGS, useValue: { … } }`.

```ts
protected readonly settings = inject(APP_SETTINGS);
```

::tryit{di-providers}

## Wenn nichts bereitgestellt ist

Fragt eine Komponente nach etwas, das niemand bereitstellt, startet die App nicht:

```bash
NG0201: No provider found for `Logger`.
```

Ist eine Abhängigkeit wirklich optional, sag das ausdrücklich – dann bekommst du `null` statt eines Fehlers:

```ts
protected readonly memory = inject(MemoryLogger, { optional: true });
```

> [!TIP]
> Abstrakte Klassen wie `Logger` eignen sich gut als Token: Sie beschreiben, was ein Logger können muss, und TypeScript prüft, dass jede Implementierung passt.

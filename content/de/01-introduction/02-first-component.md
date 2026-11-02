---
title: Deine erste Komponente
minutes: 7
quiz:
  - question: Woran erkennt Angular, wo eine Komponente im HTML verwendet wird?
    options: [Am Klassennamen, Am selector, Am Dateinamen, An der templateUrl]
    answer: 1
    explanation: Der `selector` (z. B. `app-greeting`) ist der HTML-Tag, unter dem die Komponente eingesetzt wird.
  - question: Was musst du tun, um eine Komponente im Template einer anderen Komponente zu verwenden?
    options:
      - Nichts, Komponenten sind global verfügbar
      - Sie in main.ts registrieren
      - Sie im imports-Array der anderen Komponente eintragen
      - Sie in index.html einbinden
    answer: 2
    explanation: Komponenten sind standalone. Du importierst sie über das `imports`-Array dort, wo du sie brauchst.
---

# Deine erste Komponente

Eine Angular-App besteht aus **Komponenten**. Jede Komponente ist ein Baustein der Oberfläche – zum Beispiel ein Header, eine Liste oder ein Button – und besteht aus drei Teilen:

1. einer **TypeScript-Klasse** mit Daten und Logik,
2. einem **Template** (HTML), das festlegt, was angezeigt wird,
3. optional **Styles** (CSS), die nur für diese Komponente gelten.

## Der @Component-Decorator

Eine Komponente ist eine normale Klasse mit dem Decorator `@Component`:

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-greeting',
  template: `<p>Hallo aus der Greeting-Komponente!</p>`,
  styles: `p { color: crimson; }`,
})
export class Greeting {}
```

- **`selector`** – der HTML-Tag, unter dem die Komponente verwendet wird: `<app-greeting />`
- **`template`** – das HTML der Komponente. Für größere Templates verweist du stattdessen mit `templateUrl` auf eine eigene `.html`-Datei.
- **`styles`** – CSS, das *nur* für diese Komponente gilt. Angular kapselt die Styles automatisch, sodass sie andere Komponenten nicht beeinflussen.

## Komponenten verwenden

Um eine Komponente im Template einer anderen zu nutzen, importierst du sie über das `imports`-Array:

```ts
import { Component } from '@angular/core';
import { Greeting } from './greeting';

@Component({
  selector: 'app-root',
  imports: [Greeting],
  template: `
    <h1>Meine erste Angular-App</h1>
    <app-greeting />
  `,
})
export class App {}
```

So entsteht ein **Komponentenbaum**: `App` ist die Wurzel und enthält weitere Komponenten, die wiederum andere enthalten können.

::tryit{first-component}

> [!TIP]
> Verwende im Beispiel `<app-greeting />` zweimal, oder ändere die Farbe im `styles`-Block der Greeting-Komponente.

> [!WARNING]
> Vergisst du den Eintrag in `imports`, meldet Angular den Fehler *"'app-greeting' is not a known element"*.

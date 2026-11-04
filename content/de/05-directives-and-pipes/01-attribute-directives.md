---
title: Eigene Attribut-Direktiven
minutes: 8
summary: |-
  - Eine Direktive hat kein eigenes Template – sie hängt sich an ein vorhandenes Element und verändert Aussehen oder Verhalten.
  - `selector: '[appHighlight]'` trifft jedes Element mit dem Attribut `appHighlight`. Importiert wird sie über `imports` wie eine Komponente.
  - Im `host`-Objekt bindest du Eigenschaften (`'[style.backgroundColor]'`) und Ereignisse (`'(mouseenter)'`) des Host-Elements – statt `@HostBinding`/`@HostListener`.
  - Gibt ein Binding `null` zurück, entfernt Angular den Style wieder.
  - Ein Input mit `alias` gleich dem Selektor nimmt den Attributwert direkt: `<p appHighlight="lightblue">`.
  - Denk an Tastatur-Nutzer: Höre auch auf `focusin` und `focusout`.

  ```ts
  @Directive({
    selector: '[appHighlight]',
    host: {
      '(mouseenter)': 'active.set(true)',
      '(mouseleave)': 'active.set(false)',
      '[style.backgroundColor]': "active() ? 'yellow' : null",
    },
  })
  export class Highlight {
    protected readonly active = signal(false);
  }
  ```
quiz:
  - question: Was unterscheidet eine Direktive von einer Komponente?
    options:
      - Direktiven haben ein eigenes Template, Komponenten nicht
      - Direktiven haben kein Template – sie erweitern ein vorhandenes Element
      - Direktiven funktionieren nur mit Formularen
      - Es gibt keinen Unterschied
    answer: 1
  - question: Wie reagiert eine Direktive auf ein Ereignis ihres Host-Elements?
    options:
      - Mit addEventListener im Konstruktor
      - Mit einem Eintrag wie '(mouseenter)' im host-Objekt
      - Mit (mouseenter) im Template der Direktive
      - Gar nicht, das geht nur in Komponenten
    answer: 1
  - question: "Wie erreichst du, dass `<p appHighlight=\"lightblue\">` die Farbe setzt?"
    options:
      - Mit einem Input, dessen alias gleich dem Selektor ist
      - Mit einem Output namens appHighlight
      - Mit inject(ElementRef)
      - Das geht nicht – Direktiven können keine Werte bekommen
    answer: 0
exercise:
  example: ex-directive
  title: Externe Links markieren
  task: |-
    Externe Links sollen in einem neuen Tab öffnen und als extern erkennbar sein.

    1. Mache aus `ExternalLink` eine Direktive mit dem Selektor `a[appExternalLink]`.
    2. Setze über das `host`-Objekt `target="_blank"`, `rel="noopener noreferrer"` und die Klasse `external`.
    3. Verwende sie in `app.ts` an den beiden externen Links – der interne Link bleibt, wie er ist.
  checks:
    sets-target: Beide externen Links haben `target="_blank"`
    sets-rel: Beide haben `rel="noopener noreferrer"`
    adds-class: Beide haben die Klasse `external`
    internal-untouched: Der interne Link bleibt unverändert
---

# Eigene Attribut-Direktiven

Eine **Komponente** bringt ihr eigenes Template mit. Eine **Direktive** hat keins – sie hängt sich an ein vorhandenes Element und verändert dessen Aussehen oder Verhalten. Du kennst schon Direktiven von Angular, etwa `routerLink`. Jetzt schreibst du eine eigene.

## Die einfachste Direktive

```ts
import { Directive } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  host: {
    '[style.backgroundColor]': "'yellow'",
  },
})
export class Highlight {}
```

- Der `selector` in eckigen Klammern bedeutet: „jedes Element mit dem Attribut `appHighlight`“.
- Im `host`-Objekt bindest du Eigenschaften des **Host-Elements** – also des Elements, auf dem die Direktive sitzt.

Wie Komponenten importierst du Direktiven dort, wo du sie brauchst:

```ts
@Component({
  imports: [Highlight],
  template: `<p appHighlight>Ich bin gelb.</p>`,
})
export class App {}
```

> [!TIP]
> Gib eigenen Direktiven ein Präfix wie `app`. So kollidieren sie nicht mit HTML-Attributen oder Direktiven aus Bibliotheken.

## Auf Ereignisse reagieren

Im `host`-Objekt kannst du auch auf Ereignisse des Host-Elements hören – mit runden Klammern, genau wie im Template:

```ts
@Directive({
  selector: '[appHighlight]',
  host: {
    '(mouseenter)': 'active.set(true)',
    '(mouseleave)': 'active.set(false)',
    '[style.backgroundColor]': "active() ? 'yellow' : null",
  },
})
export class Highlight {
  protected readonly active = signal(false);
}
```

Gibt ein Binding `null` zurück, entfernt Angular den Style wieder.

> [!NOTE]
> Ältere Anleitungen nutzen dafür `@HostBinding` und `@HostListener`. Das `host`-Objekt ist die empfohlene Schreibweise: alles steht an einer Stelle, und es funktioniert mit Signals.

## Werte übergeben

Direktiven bekommen Inputs genau wie Komponenten. Hat das Input denselben Namen wie der Selektor, setzt der Attributwert direkt die Farbe:

```ts
readonly color = input('', { alias: 'appHighlight' });
```

```html
<p appHighlight>Standardfarbe</p>
<p appHighlight="lightblue">Feste Farbe</p>
<p [appHighlight]="color()">Farbe aus einem Signal</p>
```

::tryit{attribute-directive}

## Barrierefreiheit nicht vergessen

Reagiert eine Direktive nur auf die Maus, gehen Tastatur-Nutzer leer aus. Die Direktive im Beispiel hört deshalb auch auf `focusin` und `focusout` – so wird ein Button auch hervorgehoben, wenn man ihn mit Tab erreicht.

> [!WARNING]
> Mit `inject(ElementRef)` kommst du an das DOM-Element und könntest es direkt verändern. Nutze das nur, wenn es mit `host`-Bindings nicht geht – direkte DOM-Zugriffe umgehen Angular und verhalten sich beim Server-Rendering oft nicht wie erwartet.

---
title: Daten übergeben mit input()
minutes: 8
quiz:
  - question: Was passiert, wenn ein mit input.required() deklariertes Input im Template fehlt?
    options:
      - Der Wert ist einfach undefined
      - Angular wirft zur Laufzeit einen Fehler
      - Das Template kompiliert nicht
      - Angular setzt einen leeren String
    answer: 2
    explanation: Der Compiler meldet `NG8008` – der Fehler fällt also schon beim Bauen auf, nicht erst beim Nutzer.
  - question: Wie liest die Kind-Komponente den Wert eines Inputs namens price?
    options: ["this.price", "this.price()", "this.price.value", "this.price.get()"]
    answer: 1
    explanation: Ein Input ist ein schreibgeschütztes Signal – du liest es durch Aufrufen.
  - question: Was bewirkt `name="Notebook"` ohne eckige Klammern?
    options:
      - Es bindet den Ausdruck Notebook
      - Es übergibt den festen String "Notebook"
      - Es ist ein Syntaxfehler
      - Es setzt ein HTML-Attribut, aber nicht das Input
    answer: 1
---

# Daten übergeben mit input()

Komponenten werden erst richtig nützlich, wenn man sie mit Daten füttern kann. Eine Produktkarte soll mal einen Becher, mal einen Rucksack zeigen. Dafür deklariert die Kind-Komponente **Inputs** – Eigenschaften, die die Eltern-Komponente im Template setzt.

## Ein Input deklarieren

```ts
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-product-card',
  template: `<h2>{{ name() }}</h2>`,
})
export class ProductCard {
  readonly name = input<string>(); // Signal<string | undefined>
}
```

`input()` erzeugt ein **schreibgeschütztes Signal**. Die Kind-Komponente liest es mit `name()`, ändert es aber nie selbst – der Wert gehört der Eltern-Komponente.

## Werte übergeben

```html
<!-- Mit eckigen Klammern: ein Ausdruck -->
<app-product-card [name]="product().title" [price]="12.5" />

<!-- Ohne Klammern: ein fester String -->
<app-product-card name="Notebook" />
```

Ändert sich der Ausdruck in der Eltern-Komponente, aktualisiert Angular das Input-Signal automatisch – und damit alles, was davon abhängt, etwa ein `computed()`.

## Standardwerte und Pflicht-Inputs

```ts
readonly price = input(0);               // Signal<number>, Standard 0
readonly name = input.required<string>(); // Signal<string>, muss gesetzt werden
```

Fehlt ein Pflicht-Input, kompiliert das Template nicht:

```bash
NG8008: Required input 'name' from component ProductCard must be specified.
```

> [!TIP]
> Nutze `input.required()` für alles, ohne das die Komponente keinen Sinn ergibt. So brauchst du im Template keine Prüfungen auf `undefined`.

## Werte umwandeln mit transform

Attribute in HTML sind immer Strings. Mit `transform` wandelst du sie beim Übergeben um. Angular bringt dafür zwei fertige Funktionen mit:

```ts
import { booleanAttribute, input, numberAttribute } from '@angular/core';

readonly price = input(0, { transform: numberAttribute });
readonly soldOut = input(false, { transform: booleanAttribute });
```

```html
<app-product-card name="Notebook" price="4.9" soldOut />
```

Jetzt ist `price()` die Zahl `4.9`, und das bloße Attribut `soldOut` wird zu `true` – genau wie bei `<button disabled>`.

## Ein anderer Name nach außen

Mit `alias` heißt das Input im Template anders als in der Klasse:

```ts
readonly label = input('', { alias: 'buttonLabel' });
```

```html
<app-button buttonLabel="Speichern" />
```

::tryit{component-inputs}

> [!NOTE]
> Daten fließen bei Inputs nur **von oben nach unten**. Wie die Kind-Komponente der Eltern-Komponente etwas mitteilt, lernst du in der nächsten Lektion.

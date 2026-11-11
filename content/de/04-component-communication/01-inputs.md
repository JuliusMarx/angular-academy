---
title: Daten übergeben mit input()
minutes: 8
summary: |-
  - `input()` erzeugt ein schreibgeschütztes Signal. Die Kind-Komponente liest es mit `name()`, der Wert gehört der Eltern-Komponente.
  - `[name]="ausdruck"` übergibt einen Ausdruck, `name="Notebook"` ohne Klammern einen festen String.
  - `input(0)` setzt einen Standardwert, `input.required<string>()` macht das Input zur Pflicht. Fehlt es, kompiliert das Template nicht (`NG8008`).
  - `transform: numberAttribute` bzw. `booleanAttribute` wandelt String-Attribute in Zahlen bzw. Booleans um.
  - Im Konstruktor sind Inputs noch nicht gesetzt. Arbeit, die Inputs braucht, gehört in `ngOnInit`, das einmal nach dem Setzen der ersten Inputs läuft.
  - Mit `alias` heißt das Input im Template anders als in der Klasse.
  - Daten fließen bei Inputs nur von oben nach unten.

  ```ts
  readonly name = input.required<string>();
  readonly price = input(0, { transform: numberAttribute });
  readonly soldOut = input(false, { transform: booleanAttribute });
  ```
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
exercise:
  example: ex-inputs
  title: Ein Preisschild
  task: |-
    Die Komponente `PriceTag` zeigt noch `? ?`.

    1. Gib ihr ein Pflicht-Input `amount` (Zahl) und ein Input `currency` mit dem Standardwert `EUR`.
    2. Zeige den Betrag mit zwei Nachkommastellen und die Währung an, z. B. `12.50 EUR`.
    3. Übergib in `app.ts` dem ersten Schild den Betrag `12.5`, dem zweiten `4.9` und die Währung `USD`.
  checks:
    shows-amount: Das erste Schild zeigt den Betrag mit zwei Nachkommastellen
    default-currency: 'Ohne Angabe ist die Währung **EUR**: `12.50 EUR`'
    custom-currency: Das zweite Schild zeigt `4.90 USD`
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

## Wann sind Inputs da? ngOnInit

Im Konstruktor sind Inputs noch nicht gesetzt. Liest du dort einen Pflicht-Input, gibt es einen Fehler (`NG0950`). Für Vorbereitungen, die Inputs brauchen, nimmst du den Lifecycle-Hook **`ngOnInit`**: Angular ruft ihn einmal auf, nachdem die ersten Inputs gesetzt sind.

```ts
export class ProductCard implements OnInit {
  readonly name = input.required<string>();

  ngOnInit() {
    console.log('Zeige', this.name()); // hier ist das Input gesetzt
  }
}
```

Das Gegenstück `ngOnDestroy` läuft, wenn die Komponente verschwindet. Alternativ registrierst du Aufräumarbeiten mit `inject(DestroyRef).onDestroy(…)`.

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

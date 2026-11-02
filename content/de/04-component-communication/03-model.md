---
title: Zwei-Wege-Bindung mit model()
minutes: 7
quiz:
  - question: Was unterscheidet model() von input()?
    options:
      - model() ist schneller
      - Die Kind-Komponente kann ein model() selbst ändern, und die Änderung erreicht die Eltern-Komponente
      - model() funktioniert nur mit Formularen
      - Es gibt keinen Unterschied
    answer: 1
  - question: Wie bindest du ein Signal quantity zweiseitig an das model value?
    options: ['[value]="quantity()"', '(value)="quantity"', '[(value)]="quantity"', '[(value)]="quantity()"']
    answer: 2
    explanation: Bei `[( )]` übergibst du das Signal selbst, ohne Klammern – Angular liest und schreibt es.
  - question: Welches Ereignis erzeugt model() automatisch für eine Eigenschaft checked?
    options: [checked, changeChecked, checkedChange, onChecked]
    answer: 2
---

# Zwei-Wege-Bindung mit model()

Manche Komponenten zeigen nicht nur einen Wert an, sondern lassen ihn auch ändern: ein Mengen-Auswahlfeld, ein Schalter, ein Schieberegler. Die Eltern-Komponente gibt den Startwert vor – und will erfahren, wenn der Nutzer ihn ändert.

Mit `input()` plus `output()` ginge das, aber `model()` erledigt beides in einem.

## Ein model deklarieren

```ts
import { Component, model } from '@angular/core';

@Component({
  selector: 'app-toggle-switch',
  template: `
    <button role="switch" [attr.aria-checked]="checked()" (click)="checked.set(!checked())">
      …
    </button>
  `,
})
export class ToggleSwitch {
  readonly checked = model(false);
}
```

`model()` ist ein **beschreibbares Signal**: Die Komponente liest es mit `checked()` und ändert es mit `set()` oder `update()`.

## Die „Banane in der Box“

In der Eltern-Komponente bindest du ein model mit `[( )]`:

```ts
protected readonly giftWrap = signal(false);
```

```html
<app-toggle-switch [(checked)]="giftWrap" />
<p>Geschenkverpackung: {{ giftWrap() ? 'ja' : 'nein' }}</p>
```

Jetzt fließen Änderungen in **beide Richtungen**:

- Setzt die Eltern-Komponente `giftWrap.set(true)`, schaltet der Schalter um.
- Klickt der Nutzer auf den Schalter, ändert sich `giftWrap` in der Eltern-Komponente.

> [!NOTE]
> Bei `[(checked)]` übergibst du das **Signal selbst** – `giftWrap`, nicht `giftWrap()`. Angular braucht das Signal, um hineinschreiben zu können.

## Was dahintersteckt

`[(checked)]="giftWrap"` ist eine Kurzform für zwei Bindungen:

```html
<app-toggle-switch [checked]="giftWrap()" (checkedChange)="giftWrap.set($event)" />
```

`model()` erzeugt das Output `checkedChange` automatisch – also immer *Name* + `Change`. Wer nur zuhören will, kann `(checkedChange)` auch einzeln binden.

## Pflicht-models und Grenzen

Wie bei Inputs gibt es `model.required<T>()`. Prüfe Grenzen immer in der Logik der Komponente – ein deaktivierter Button allein reicht nicht:

```ts
readonly value = model(1);
readonly max = input(99);

change(delta: number): void {
  this.value.update((v) => Math.min(this.max(), Math.max(1, v + delta)));
}
```

::tryit{component-model}

> [!WARNING]
> `[disabled]` verhindert keine Klicks, die schneller kommen, als Angular die Ansicht aktualisiert. Im Beispiel wäre die Menge ohne die Prüfung in `change()` über das Maximum gestiegen.

---
title: Zwei-Wege-Bindung mit model()
minutes: 7
summary: |-
  - `model()` ist ein beschreibbares Signal: Die Kind-Komponente liest es mit `checked()` und ändert es mit `set()` oder `update()`.
  - In der Eltern-Komponente bindest du es zweiseitig mit `[(checked)]="giftWrap"` („Banane in der Box“).
  - Bei `[( )]` übergibst du das Signal selbst – `giftWrap`, nicht `giftWrap()`.
  - `model()` erzeugt automatisch das Output *Name* + `Change`, z. B. `checkedChange`.
  - Wie bei Inputs gibt es `model.required<T>()`. Grenzen prüfst du in der Logik der Komponente, nicht nur per `[disabled]`.

  ```ts
  // Kind
  readonly checked = model(false);
  // Eltern
  protected readonly giftWrap = signal(false);
  // <app-toggle-switch [(checked)]="giftWrap" />
  ```
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
exercise:
  example: ex-model
  title: Ein Zwei-Wege-Zähler
  task: |-
    Der Stepper bekommt seinen Wert per Input, kann ihn aber nicht ändern.

    1. Mache aus `value` in `stepper.ts` ein `model()` und ändere den Wert in `change()`.
    2. Binde den Stepper in `app.ts` mit `[(value)]` an `guests`.
  checks:
    child-changes: '**+** erhöht den Wert im Stepper'
    parent-sees-change: Die Eltern-Komponente sieht den neuen Wert
    parent-sets-value: '**Set to 5** ändert den Stepper, und **−** wirkt danach auch in der Eltern-Komponente'
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

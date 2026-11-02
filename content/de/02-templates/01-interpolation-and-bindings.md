---
title: Interpolation & Bindings
minutes: 8
quiz:
  - question: Wie zeigst du den Wert des Signals title im Template an?
    options: ["{{ title }}", "{{ title() }}", "[title]", "(title)"]
    answer: 1
    explanation: Signals sind Funktionen – du liest ihren Wert, indem du sie aufrufst.
  - question: Welche Syntax bindet ein Ereignis wie einen Klick?
    options: ['[click]="save()"', "{{ click }}", '(click)="save()"', 'on-click="save"']
    answer: 2
    explanation: Runde Klammern stehen für Event-Binding – Daten fließen vom Template in die Klasse.
  - question: Was bewirkt [disabled]="isEmpty()"?
    options:
      - Es setzt das disabled-Attribut einmalig beim Start
      - Es bindet die DOM-Eigenschaft disabled an den Ausdruck und aktualisiert sie automatisch
      - Es ruft bei einem Klick isEmpty() auf
      - Gar nichts, das ist keine gültige Syntax
    answer: 1
exercise:
  example: ex-bindings
  title: Eine persönliche Begrüßung
  task: |-
    Verbinde Eingabefeld, Überschrift und Button mit dem Signal `name`:

    1. Die Überschrift zeigt `Hello, <Name>!` mit dem Namen aus dem Signal.
    2. Das Eingabefeld zeigt den Namen an (`[value]`) und schreibt Änderungen zurück (`(input)`).
    3. **Clear** leert den Namen und ist deaktiviert, solange kein Name eingegeben ist.
  checks:
    greeting-updates: 'Tippen ändert die Begrüßung, z. B. zu **Hello, Ada!**'
    clear-empties: '**Clear** leert Eingabefeld und Begrüßung'
    clear-disabled: '**Clear** ist bei leerem Namen deaktiviert'
---

# Interpolation & Bindings

Templates verbinden deine Daten mit dem HTML. Angular kennt dafür drei grundlegende Schreibweisen:

| Syntax | Name | Richtung |
|---|---|---|
| `{{ wert }}` | Interpolation | Klasse → Template (Text) |
| `[eigenschaft]="wert"` | Property-Binding | Klasse → Template (DOM-Eigenschaft) |
| `(ereignis)="handler()"` | Event-Binding | Template → Klasse |

## Interpolation

Mit doppelten geschweiften Klammern gibst du einen Wert als Text aus:

```ts
@Component({
  selector: 'app-root',
  template: `
    <h1>Hallo, {{ name() }}!</h1>
    <p>Dein Name hat {{ name().length }} Zeichen.</p>
  `,
})
export class App {
  protected readonly name = signal('Angular');
}
```

Innerhalb von `{{ }}` steht ein **Template-Ausdruck** – ähnlich wie JavaScript, aber bewusst eingeschränkt. Komplexe Logik gehört in die Klasse.

> [!NOTE]
> `name` ist hier ein **Signal**. Du liest seinen Wert, indem du es wie eine Funktion aufrufst: `name()`. Mehr dazu im Kapitel *Signals*.

## Property-Binding

Mit eckigen Klammern bindest du eine DOM-Eigenschaft an einen Ausdruck. Ändert sich der Wert, aktualisiert Angular das Element automatisch:

```html
<input [value]="name()" />
<button [disabled]="name() === ''">Leeren</button>
<img [src]="logoUrl" [alt]="logoText" />
```

Für CSS-Klassen und Styles gibt es eigene Schreibweisen:

```html
<p [class.active]="isActive()">…</p>
<p [style.color]="color()">…</p>
```

## Event-Binding

Mit runden Klammern reagierst du auf Ereignisse. Über `$event` erhältst du das DOM-Ereignis:

```ts
@Component({
  selector: 'app-root',
  template: `
    <input [value]="name()" (input)="onInput($event)" />
    <button (click)="name.set('')">Leeren</button>
  `,
})
export class App {
  protected readonly name = signal('Angular');

  protected onInput(event: Event): void {
    this.name.set((event.target as HTMLInputElement).value);
  }
}
```

::tryit{template-bindings}

> [!TIP]
> Zusammen ergeben Property- und Event-Binding einen Datenfluss in beide Richtungen: Der Wert fließt per `[value]` ins Eingabefeld, Änderungen kommen per `(input)` zurück.

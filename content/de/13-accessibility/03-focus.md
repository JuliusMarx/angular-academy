---
title: Fokus-Management
minutes: 10
summary: |-
  - Alles, was mit der Maus geht, muss auch mit der Tastatur gehen: <kbd>Tab</kbd>, <kbd>Shift</kbd>+<kbd>Tab</kbd>, Enter, Leertaste, Escape.
  - Der Fokus muss immer sichtbar sein. Entferne `outline` nie ohne Ersatz, nutze `:focus-visible`.
  - `tabindex="0"` nimmt ein Element in die Tab-Reihenfolge auf, `tabindex="-1"` macht es nur per `focus()` fokussierbar. Positive Werte vermeiden.
  - Nach einem Routenwechsel bleibt der Fokus sonst irgendwo hängen. Setz ihn bei `NavigationEnd` auf die Überschrift oder `<main>` und gib jeder Route einen `title`.
  - Native `<dialog>` mit `showModal()` setzt den Fokus in den Dialog, macht den Rest der Seite inert, schließt mit Escape und gibt den Fokus beim Schließen zurück.
  - Für eigene Overlays hilft `@angular/cdk/a11y`: `cdkTrapFocus` hält den Fokus in einem Bereich, `FocusMonitor` meldet, ob per Maus, Tastatur oder Code fokussiert wurde.

  ```ts
  readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  open(): void {
    this.dialog().nativeElement.showModal();
  }
  ```
quiz:
  - question: "Was bewirkt `tabindex=\"-1\"` auf einer Überschrift?"
    options:
      - Sie lässt sich per `focus()` fokussieren, ist aber nicht in der Tab-Reihenfolge
      - Sie wird mit Tab als Erstes erreicht
      - Sie wird vor Screenreadern versteckt
      - Sie wird zum Button
    answer: 0
  - question: "Was passiert beim Schließen eines `<dialog>`, der mit `showModal()` geöffnet wurde?"
    options:
      - Der Fokus springt an den Anfang der Seite
      - Der Fokus bleibt im unsichtbaren Dialog
      - Der Browser setzt den Fokus zurück auf das Element, das vorher fokussiert war, meist der öffnende Button
      - Die Seite lädt neu
    answer: 2
  - question: Warum solltest du nach einem Routenwechsel den Fokus setzen?
    options:
      - Damit Angular die Seite schneller lädt
      - Weil eine Single-Page-App die Seite nicht neu lädt – ohne eigenen Fokus merken Tastatur- und Screenreader-Nutzer den Wechsel kaum
      - Weil der Router sonst einen Fehler wirft
      - Das ist nicht nötig, der Browser macht das immer selbst
    answer: 1
---

# Fokus-Management

Wer die Tastatur benutzt, bewegt sich mit <kbd>Tab</kbd> von Element zu Element. Das Element mit dem **Fokus** empfängt die Tasten. Die meiste Arbeit nimmt dir der Browser ab – solange du native Elemente verwendest. Schwierig wird es, wenn sich die Seite ändert, ohne neu zu laden: bei Routenwechseln, Dialogen und gelöschten Elementen.

## Tastatur-Grundlagen

| Taste | Erwartung |
|---|---|
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | zum nächsten / vorigen bedienbaren Element |
| <kbd>Enter</kbd> | Link öffnen, Button auslösen |
| <kbd>Leertaste</kbd> | Button auslösen, Checkbox umschalten |
| <kbd>Escape</kbd> | Dialog oder Menü schließen |
| Pfeiltasten | innerhalb von Widgets wie Tabs, Menüs, Radiogruppen |

Teste deine App regelmäßig ohne Maus. Kommst du überall hin? Siehst du immer, wo der Fokus ist?

## Den Fokus sichtbar halten

Browser zeichnen einen Fokusrahmen. Entferne ihn nie ersatzlos:

```css
/* schlecht */
button:focus {
  outline: none;
}

/* gut: eigener Rahmen, nur bei Tastaturbedienung */
button:focus-visible {
  outline: 3px solid #1a73e8;
  outline-offset: 2px;
}
```

`:focus-visible` greift, wenn der Browser einen Fokusrahmen für sinnvoll hält – bei Tastatur ja, bei einem Mausklick auf einen Button meist nicht.

## tabindex

| Wert | Wirkung |
|---|---|
| `tabindex="0"` | Element kommt in die normale Tab-Reihenfolge |
| `tabindex="-1"` | nicht per Tab erreichbar, aber per `element.focus()` fokussierbar |
| `tabindex="1"` und höher | springt vor alle anderen – vermeiden, das bringt die Reihenfolge durcheinander |

`tabindex="-1"` brauchst du, um den Fokus gezielt auf etwas zu setzen, das normalerweise nicht fokussierbar ist, etwa eine Überschrift.

## Fokus nach einem Routenwechsel

Bei einer klassischen Website lädt jeder Link eine neue Seite, und der Screenreader beginnt oben. Eine Angular-App tauscht nur den Inhalt im `<router-outlet>`. Der Fokus bleibt auf dem angeklickten Link, und wer nichts sieht, merkt den Wechsel kaum.

Setz den Fokus deshalb nach jeder Navigation auf den Hauptinhalt:

```ts
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <nav>…</nav>
    <main #main tabindex="-1">
      <router-outlet />
    </main>
  `,
})
export class App {
  private readonly main = viewChild.required<ElementRef<HTMLElement>>('main');

  constructor() {
    inject(Router)
      .events.pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.main().nativeElement.focus());
  }
}
```

Wohin der Fokus genau soll, hängt vom Layout ab: auf `<main>` oder auf die `<h1>` der neuen Seite (dann mit `tabindex="-1"`). Wichtig ist nur, dass er nicht auf `<body>` zurückfällt oder auf dem alten Link bleibt.

Gib außerdem jeder Route einen `title`. Der Router setzt ihn als Seitentitel. So unterscheiden sich Tabs und Verlauf, und Screenreader-Nutzer können jederzeit abfragen, wo sie sind. Von selbst angesagt wird ein neuer Titel nach einer Navigation in einer Single-Page-App meist nicht, deshalb braucht es zusätzlich den Fokus:

```ts
export const routes: Routes = [
  { path: 'cart', component: Cart, title: 'Warenkorb' },
];
```

## Dialoge mit `<dialog>`

Ein modaler Dialog muss einiges können: Fokus hinein, Fokus drin halten, Escape schließt, danach Fokus zurück. Das native `<dialog>`-Element erledigt all das, wenn du es mit `showModal()` öffnest:

```ts
@Component({
  selector: 'app-root',
  template: `
    <button type="button" (click)="dialog.showModal()">Konto löschen …</button>

    <dialog #dialog aria-labelledby="dialog-title" (close)="result.set(dialog.returnValue)">
      <h2 id="dialog-title">Konto löschen?</h2>
      <form method="dialog">
        <button value="cancel" autofocus>Abbrechen</button>
        <button value="delete">Löschen</button>
      </form>
    </dialog>
  `,
})
export class App {
  protected readonly result = signal('');
}
```

- `showModal()` setzt den Fokus auf das erste fokussierbare Element oder auf das mit `autofocus`.
- Der Rest der Seite wird **inert**: nicht klickbar, nicht fokussierbar, für Screenreader unsichtbar.
- <kbd>Escape</kbd> schließt den Dialog.
- Ein Button in `<form method="dialog">` schließt ihn, sein `value` landet in `returnValue`.
- Beim Schließen setzt der Browser den Fokus zurück auf das Element, das vorher fokussiert war.

> [!TIP]
> Setz `autofocus` bei einer gefährlichen Aktion auf den harmlosen Button (hier „Abbrechen“). Ein versehentliches Enter löscht dann nichts.

## Fokus nach dem Löschen

Löscht jemand einen Eintrag, verschwindet der Button mit dem Fokus. Der Fokus fällt dann auf `<body>`, und wer die Tastatur nutzt, muss von vorne anfangen. Setz ihn auf ein sinnvolles Ziel, zum Beispiel die Überschrift der Liste:

```ts
protected remove(item: Item): void {
  this.items.update((items) => items.filter((i) => i !== item));
  this.heading().nativeElement.focus(); // <h2 #heading tabindex="-1">
}
```

::tryit{a11y-focus}

## Das CDK: `@angular/cdk/a11y`

Für eigene Overlays, Menüs und Listen bringt das Angular CDK fertige Bausteine mit. Du installierst es mit `npm install @angular/cdk`.

**FocusTrap** hält den Fokus mit <kbd>Tab</kbd> und <kbd>Shift</kbd>+<kbd>Tab</kbd> innerhalb eines Bereichs:

```ts
import { CdkTrapFocus } from '@angular/cdk/a11y';

@Component({
  imports: [CdkTrapFocus],
  template: `
    <div class="panel" cdkTrapFocus cdkTrapFocusAutoCapture>
      <input cdkFocusInitial />
      <button type="button" (click)="close()">Fertig</button>
    </div>
  `,
})
export class Panel {}
```

`cdkTrapFocusAutoCapture` setzt den Fokus beim Erscheinen in den Bereich (auf `cdkFocusInitial`, falls vorhanden) und gibt ihn beim Verschwinden zurück. Mausklicks nach draußen verhindert die Direktive nicht.

**FocusMonitor** meldet, wie ein Element den Fokus bekommen hat: `'keyboard'`, `'mouse'`, `'touch'`, `'program'` oder `null` beim Verlassen. Zusätzlich setzt er Klassen wie `cdk-keyboard-focused`.

```ts
const origin$ = inject(FocusMonitor).monitor(element); // später: stopMonitoring(element)
```

> [!NOTE]
> Für Dialoge gibt es im CDK auch `Dialog` aus `@angular/cdk/dialog` und in Angular Material `MatDialog`. Beide kümmern sich um Fokusfalle, Escape und Fokus-Rückgabe. Für einfache Fälle reicht das native `<dialog>`.

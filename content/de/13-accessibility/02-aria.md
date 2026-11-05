---
title: ARIA in Angular
minutes: 10
summary: |-
  - ARIA ergänzt Rolle, Name und Zustand im Accessibility-Baum. Es ändert kein Verhalten: `role="button"` macht ein Element weder fokussierbar noch per Tastatur bedienbar.
  - Erste Regel: Gibt es ein natives Element, nimm es. Keine ARIA ist besser als falsche ARIA.
  - Zustände bindest du mit `[attr.aria-expanded]`, `[attr.aria-pressed]`, `[attr.aria-invalid]`. `null` entfernt das Attribut.
  - `aria-describedby` und `aria-controls` verweisen auf ids. Jede Instanz einer Komponente braucht eigene ids, z. B. über einen Zähler.
  - In Direktiven setzt du Rolle und ARIA-Attribute im `host`-Objekt.
  - `@angular/aria` bietet fertige, ungestylte Direktiven für Muster wie Akkordeon, Tabs oder Combobox – in Angular 21 als Developer Preview, seit Angular 22 stabil.

  ```ts
  let nextId = 0;

  @Component({
    selector: 'app-disclosure',
    template: `
      <button type="button" [attr.aria-expanded]="open()" [attr.aria-controls]="panelId" (click)="open.set(!open())">
        {{ label() }}
      </button>
      <div [id]="panelId" [hidden]="!open()"><ng-content /></div>
    `,
  })
  export class Disclosure {
    readonly label = input.required<string>();
    protected readonly open = signal(false);
    protected readonly panelId = `disclosure-${nextId++}`;
  }
  ```
quiz:
  - question: "Was passiert, wenn du einem `<div>` nur `role=\"button\"` gibst?"
    options:
      - Es verhält sich jetzt genau wie ein `<button>`
      - Screenreader nennen es Button, aber es ist weder fokussierbar noch per Enter oder Leertaste bedienbar
      - Angular wirft einen Fehler
      - Es wird automatisch zu einem `<button>` umgewandelt
    answer: 1
    explanation: "ARIA ändert nur, was im Accessibility-Baum steht. Fokus und Tastatur musst du selbst nachbauen. Eine Rolle ist ein Versprechen."
  - question: "Eine Komponente setzt `id=\"hint\"` und `aria-describedby=\"hint\"`. Was geht schief, wenn sie dreimal auf der Seite steht?"
    options:
      - Nichts, ids dürfen mehrfach vorkommen
      - Angular benennt die ids automatisch um
      - Die Komponente lässt sich nur einmal verwenden
      - Die id gibt es dreimal – alle Felder verweisen auf den ersten Hinweis
    answer: 3
    explanation: "ids müssen auf der Seite eindeutig sein. Erzeuge pro Instanz eine eigene, etwa mit einem Zähler auf Modulebene."
  - question: Wie setzt eine Direktive `aria-pressed` auf ihrem Host-Element?
    options:
      - "Mit `'[attr.aria-pressed]': 'pressed()'` im `host`-Objekt"
      - "Mit `@HostListener('aria-pressed')`"
      - "Mit `document.querySelector()` im Konstruktor"
      - Gar nicht, das geht nur in Komponenten
    answer: 0
exercise:
  example: ex-a11y-faq
  title: Ein barrierefreies FAQ
  task: |-
    Die Fragen im FAQ lassen sich nur mit der Maus öffnen, und Screenreader erfahren nicht, ob eine Antwort offen ist. Baue `FaqItem` nach dem Disclosure-Muster um:

    1. Ersetze das `<div>` mit dem `(click)` durch ein `<button type="button">`. Es bleibt in der `<h3>`.
    2. Binde `aria-expanded` an das Signal `open`.
    3. Gib jeder Antwort eine eigene id (Zähler auf Modulebene) und verknüpfe den Button mit `aria-controls`.
  checks:
    uses-button: "Jede Frage ist ein `<button>` in der `<h3>`"
    expanded-state: "`aria-expanded` wechselt zwischen `false` und `true`, die Antwort erscheint und verschwindet"
    controls-panel: "`aria-controls` zeigt auf die eigene Antwort, jede id gibt es nur einmal"
---

# ARIA in Angular

Manchmal reicht HTML nicht. Ein Button klappt einen Bereich auf – aber woher weiß ein Screenreader, ob er gerade offen ist? Dafür gibt es **ARIA** (*Accessible Rich Internet Applications*): Attribute, die Rolle, Name und Zustand im Accessibility-Baum ergänzen.

## Keine ARIA ist besser als falsche ARIA

ARIA ändert nur, was der Screenreader hört. Das Verhalten ändert es nicht:

```html
<div role="button" (click)="save()">Speichern</div>
```

Der Screenreader sagt jetzt „Speichern, Button“. Aber das Element ist nicht fokussierbar und reagiert nicht auf Enter. Eine Rolle ist ein Versprechen, und hier wird es gebrochen. Für Nutzer ist das schlimmer als gar keine Rolle.

Deshalb gelten ein paar Regeln:

1. Gibt es ein natives Element mit der Bedeutung, nimm es.
2. Ändere nicht die Bedeutung nativer Elemente (kein `<h2 role="button">`).
3. Alles, was eine interaktive Rolle hat, muss per Tastatur bedienbar sein.
4. Versteck nichts Fokussierbares mit `aria-hidden="true"`.
5. Jedes interaktive Element braucht einen Namen.

## Die wichtigsten Attribute

| Attribut | Wofür |
|---|---|
| `aria-label` | Name, wenn kein sichtbarer Text da ist (z. B. Icon-Button) |
| `aria-labelledby` | Name aus einem anderen Element (per id) |
| `aria-describedby` | Zusätzliche Beschreibung, z. B. Hinweis oder Fehler (per id) |
| `aria-expanded` | Ist der zugehörige Bereich offen? (`true`/`false`) |
| `aria-controls` | Welches Element steuert der Button? (per id) |
| `aria-pressed` | Umschalt-Button gedrückt? (`true`/`false`) |
| `aria-invalid` | Ist die Eingabe ungültig? |
| `aria-hidden` | Element vor Screenreadern verstecken (z. B. dekorative Icons) |

Feste Werte schreibst du einfach ins Template. Wechselnde Werte bindest du mit `attr.`:

```html
<button type="button" aria-label="Schließen">✕</button>
<button type="button" [attr.aria-pressed]="muted()" (click)="toggleMute()">Stumm</button>
```

Angular macht aus `true` und `false` die Texte `"true"` und `"false"`, genau wie ARIA sie erwartet.

## Auf- und zuklappen: das Disclosure-Muster

Ein Button, der einen Bereich ein- und ausblendet, heißt im ARIA-Leitfaden **Disclosure**. Nötig sind:

- ein echter `<button>` (bringt Fokus, Enter und Leertaste mit),
- `aria-expanded` mit dem aktuellen Zustand,
- optional `aria-controls` mit der id des Bereichs.

```ts
let nextId = 0;

@Component({
  selector: 'app-disclosure',
  template: `
    <button type="button" [attr.aria-expanded]="open()" [attr.aria-controls]="panelId" (click)="open.set(!open())">
      {{ label() }}
    </button>
    <div [id]="panelId" [hidden]="!open()">
      <ng-content />
    </div>
  `,
})
export class Disclosure {
  readonly label = input.required<string>();
  protected readonly open = signal(false);
  protected readonly panelId = `disclosure-${nextId++}`;
}
```

`[hidden]` versteckt den Bereich, lässt ihn aber im DOM. So zeigt `aria-controls` immer auf ein vorhandenes Element.

## Eindeutige ids pro Instanz

`aria-controls`, `aria-describedby` und `aria-labelledby` verweisen auf **ids**. Steht eine Komponente mehrmals auf der Seite, gäbe es eine feste id mehrmals – und alle Verweise landen beim ersten Element.

Die Lösung von oben: ein Zähler **außerhalb** der Klasse. Er existiert einmal pro Modul, jede neue Instanz bekommt die nächste Nummer (`disclosure-0`, `disclosure-1`, …).

Dasselbe gilt für Hinweise und Fehler an Formularfeldern:

```html
<label [for]="id">Passwort</label>
<input [id]="id" type="password" [attr.aria-describedby]="id + '-hint'" [attr.aria-invalid]="tooShort()" />
<p [id]="id + '-hint'">Mindestens 8 Zeichen.</p>
```

Der Screenreader liest dann beim Fokus „Passwort, Mindestens 8 Zeichen“.

## ARIA in Direktiven

Eine Direktive setzt Rolle und Zustände über das `host`-Objekt. Das Beispiel macht aus jedem Button einen Umschalt-Button:

```ts
@Directive({
  selector: 'button[appToggle]',
  host: {
    '[attr.aria-pressed]': 'pressed()',
    '(click)': 'pressed.set(!pressed())',
  },
})
export class Toggle {
  readonly pressed = model(false);
}
```

Der Selektor `button[appToggle]` sorgt dafür, dass die Direktive nur auf echten Buttons sitzt. Fokus und Tastatur kommen so vom Browser.

::tryit{a11y-aria}

## Fertige Muster: @angular/aria

Komplexe Widgets wie Tabs, Menüs, Combobox oder Baumansichten brauchen viel mehr: Pfeiltasten, Fokus-Steuerung, passende Rollen. Das selbst zu bauen ist aufwendig und fehleranfällig.

Das Paket **`@angular/aria`** bietet dafür fertige Direktiven ohne eigenes Aussehen (*headless*): Accordion, Combobox, Grid, Listbox, Menu, Tabs, Toolbar, Tree und weitere. Sie kümmern sich um Tastatur, ARIA-Attribute und Fokus, du lieferst HTML und CSS. Mit Angular 21 erschien es als **Developer Preview**, seit Angular 22 ist es **stabil**.

```bash
npm install @angular/aria
```

> [!NOTE]
> Bevor du ein Widget selbst baust: Schau in den [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/patterns/) (APG) des W3C. Dort steht für jedes Muster, welche Rollen, Attribute und Tasten nötig sind.

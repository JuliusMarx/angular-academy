---
title: Änderungen ansagen und testen
minutes: 10
summary: |-
  - Ändert sich etwas, ohne dass der Fokus dorthin wandert („In den Warenkorb gelegt“), erfährt ein Screenreader davon nur über eine **Live-Region**.
  - `role="status"` (bzw. `aria-live="polite"`) wartet, bis der Screenreader fertig ist. `role="alert"` (`aria-live="assertive"`) unterbricht – nur für Dringendes.
  - Die Live-Region muss schon im DOM stehen, bevor sich ihr Inhalt ändert. Nicht erst mit `@if` einblenden.
  - `LiveAnnouncer` aus `@angular/cdk/a11y` sagt Texte an, ohne dass du eine Region ins Template schreibst: `announce('Gespeichert')`.
  - Automatisch prüfen: axe als Browser-Erweiterung, Lighthouse, `@axe-core/playwright` in UI-Tests, Regeln von angular-eslint für Templates.
  - Tests mit `getByRole()` (Playwright, Testing Library) finden Elemente wie ein Screenreader. Findet der Test einen Button nicht, findet ihn ein Screenreader-Nutzer auch nicht.
  - Automatische Tests finden nur einen Teil der Probleme. Teste zusätzlich mit Tastatur und Screenreader.

  ```html
  <button type="button" (click)="add(product)">In den Warenkorb</button>
  <p role="status">{{ message() }}</p>
  ```
quiz:
  - question: "Warum wird die Meldung in `@if (saved()) { <p role=\"status\">Gespeichert</p> }` oft nicht vorgelesen?"
    options:
      - "`role=\"status\"` funktioniert nur mit `aria-live=\"off\"`"
      - Screenreader lesen grundsätzlich keine Absätze vor
      - "`@if` ist für Screenreader unsichtbar"
      - Die Live-Region entsteht zusammen mit ihrem Text – Screenreader melden aber nur Änderungen in Regionen, die sie schon kennen
    answer: 3
    explanation: "Lass die Region dauerhaft im DOM und ändere nur ihren Inhalt: `<p role=\"status\">{{ message() }}</p>`."
  - question: Wann ist `aria-live="assertive"` bzw. `role="alert"` angebracht?
    options:
      - Für jede Meldung, damit sie sicher ankommt
      - Nur für dringende Meldungen, etwa einen Fehler, der sofort Aufmerksamkeit braucht
      - Für Ladeanzeigen
      - Nie, das ist veraltet
    answer: 1
  - question: "Ein Test mit `getByRole('button', { name: 'Speichern' })` findet den Button nicht. Was ist die wahrscheinlichste Ursache?"
    options:
      - Playwright unterstützt keine Buttons
      - Der Test läuft zu schnell
      - Der „Button“ ist ein `<div>` ohne Rolle, oder sein Name ist ein anderer
      - "`getByRole()` sucht nur nach ids"
    answer: 2
    explanation: "`getByRole()` sucht im Accessibility-Baum. Ein `<div>` mit `(click)` hat dort keine Rolle `button` – für Screenreader ist es genauso unsichtbar."
---

# Änderungen ansagen und testen

Sehende bemerken, wenn irgendwo „In den Warenkorb gelegt“ aufblitzt. Ein Screenreader liest aber nur vor, wo der Fokus ist. Änderungen an anderer Stelle bekommt er nur mit, wenn du sie **ansagst**.

## Live-Regionen

Eine **Live-Region** ist ein Bereich, dessen Änderungen der Screenreader von selbst vorliest:

```html
<button type="button" (click)="add(product)">In den Warenkorb</button>
<p role="status">{{ message() }}</p>
```

| Variante | Verhalten | Wofür |
|---|---|---|
| `role="status"` / `aria-live="polite"` | wartet, bis der Screenreader fertig ist | Bestätigungen, Suchergebnisse, „Gespeichert“ |
| `role="alert"` / `aria-live="assertive"` | unterbricht sofort | dringende Fehler |

Nimm fast immer `polite`. Eine Meldung, die ständig unterbricht, nervt und lenkt ab.

> [!WARNING]
> Die Region muss **vor** der Änderung im DOM stehen. Erscheint sie mit `@if` zusammen mit ihrem Text, wird sie oft nicht vorgelesen. Lass das Element stehen und ändere nur den Inhalt.

`aria-atomic="true"` sorgt dafür, dass immer der ganze Inhalt vorgelesen wird, nicht nur der geänderte Teil. Das ist nützlich bei Texten wie „3 Artikel im Warenkorb“.

## LiveAnnouncer aus dem CDK

Manchmal gibt es im Template keinen passenden Platz für eine Region, etwa in einem Service. Dann hilft `LiveAnnouncer` aus `@angular/cdk/a11y`. Er legt selbst eine unsichtbare Live-Region an und setzt den Text hinein:

```ts
import { LiveAnnouncer } from '@angular/cdk/a11y';

export class Cart {
  private readonly announcer = inject(LiveAnnouncer);

  add(product: Product): void {
    // …
    this.announcer.announce(`${product.name} liegt im Warenkorb`);
  }
}
```

`announce()` nimmt optional die Dringlichkeit (`'polite'` ist Standard, oder `'assertive'`) und eine Dauer in Millisekunden, nach der die Meldung wieder entfernt wird.

> [!NOTE]
> Inhalte aus einem `@defer`-Block werden nicht automatisch angesagt. Soll das Nachladen hörbar sein, umgib den Block mit einer Live-Region.

## Automatisch prüfen mit axe

**axe** von Deque ist das verbreitetste Werkzeug für automatische Prüfungen. Es findet fehlende Labels, zu wenig Kontrast, kaputte ARIA-Verweise und vieles mehr.

- **Im Browser:** die Erweiterung *axe DevTools* oder Lighthouse in den Chrome DevTools (Lighthouse nutzt intern axe).
- **In UI-Tests:** `@axe-core/playwright` prüft die Seite in einem echten Browser:

```ts
import AxeBuilder from '@axe-core/playwright';

test('has no detectable a11y issues', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  expect(results.violations).toEqual([]);
});
```

- **Im Editor:** angular-eslint hat Regeln für Templates, z. B. `alt-text`, `label-has-associated-control`, `click-events-have-key-events` oder `interactive-supports-focus`. Du schaltest sie mit `angular.configs.templateAccessibility` in der `eslint.config.js` ein.

> [!WARNING]
> Automatische Tools finden nur einen Teil der Probleme. Ob ein `alt`-Text sinnvoll ist oder die Fokus-Reihenfolge logisch, merkt kein Tool. Teste zusätzlich selbst: einmal nur mit Tastatur, einmal mit Screenreader (NVDA unter Windows, VoiceOver unter macOS und iOS, TalkBack unter Android).

## Testen mit Rollen

Tests, die Elemente über **Rolle und Namen** suchen, prüfen die Barrierefreiheit nebenbei mit. Im Kapitel Testing hast du das mit Playwright schon gesehen:

```ts
await page.getByRole('button', { name: 'Add Mug to cart' }).click();
await expect(page.getByRole('status')).toHaveText('Mug added to cart');
```

Ist der Button ein `<div>`, findet `getByRole('button')` ihn nicht – der Test schlägt fehl, genau wie die Bedienung per Screenreader.

Dasselbe Prinzip gibt es für Komponententests mit der **Angular Testing Library** (`@testing-library/angular`):

```ts
import { fireEvent, render, screen } from '@testing-library/angular';

it('adds a product to the cart', async () => {
  await render(ProductList);
  fireEvent.click(screen.getByRole('button', { name: 'Add Mug to cart' }));
  expect(screen.getByRole('status').textContent).toContain('Mug added to cart');
});
```

`render()` erzeugt die Komponente mit `TestBed`, `screen` sucht im gerenderten DOM. Das `fireEvent` der Angular Testing Library aktualisiert nach dem Ereignis auch gleich die Ansicht.

Im Beispiel laufen UI-Tests mit `getByRole()` gegen eine kleine Shop-Seite. Ändere einen Button in ein `<div>` und schau, welcher Test fehlschlägt.

::tryit{a11y-testing}

## Geschafft!

Du kennst jetzt die wichtigsten Bausteine von Angular: Komponenten und Templates, Signals, Kommunikation zwischen Komponenten, Direktiven und Pipes, Services und DI, Routing, Formulare, HTTP, RxJS, Testing, die fortgeschrittenen Themen und Barrierefreiheit.

Der beste nächste Schritt ist ein eigenes Projekt. Starte mit `ng new`, nimm dir eine kleine Idee vor und baue sie Stück für Stück. Wenn du nicht weiterweißt, findest du hier jede Lektion über die Suche wieder (<kbd>Strg</kbd>+<kbd>K</kbd>).

---
title: UI-Tests mit Playwright
minutes: 10
quiz:
  - question: Was unterscheidet einen UI-Test (End-to-End-Test) von einem Komponententest?
    options:
      - Er ist schneller
      - Er startet die ganze App in einem echten Browser und bedient sie wie ein Nutzer
      - Er testet nur das CSS
      - Er braucht kein Angular
    answer: 1
  - question: "Warum ist `await page.waitForTimeout(2000)` vor einer Prüfung eine schlechte Idee?"
    options:
      - Die Funktion gibt es nicht
      - Feste Wartezeiten machen Tests langsam und trotzdem unzuverlässig – Playwright wartet ohnehin automatisch
      - Zwei Sekunden sind zu kurz
      - Sie stoppt den Server
    answer: 1
  - question: Welcher Locator ist am robustesten?
    options:
      - "`page.locator('div > div:nth-child(3) button')`"
      - "`page.getByRole('button', { name: 'Subscribe' })`"
      - "`page.locator('.btn-primary')`"
      - "`page.locator('#button-17')`"
    answer: 1
    explanation: "`getByRole()` sucht so, wie Nutzer und Screenreader die Seite sehen. Der Test bricht nicht, wenn sich Struktur oder CSS-Klassen ändern, und prüft nebenbei die Barrierefreiheit."
exercise:
  example: ex-test-e2e
  title: UI-Tests für eine Newsletter-Anmeldung
  task: |-
    Schreibe in `e2e/newsletter.spec.ts` zwei weitere Tests:

    1. Eine ungültige Adresse (z. B. `jane.example.com`) zeigt nach **Subscribe** die Fehlermeldung (Rolle `alert`).
    2. Eine gültige Adresse zeigt die Bestätigung (Rolle `status`) mit genau dieser Adresse.

    Deine Tests laufen auch gegen kaputte Versionen der App. Jede davon soll ein Test bemerken.
  checks:
    tests-pass: Deine Tests laufen gegen die echte App durch
    catches-validation-bug: Ein Test bemerkt, wenn ungültige Adressen angenommen werden
    catches-confirmation-bug: Ein Test bemerkt, wenn keine Bestätigung erscheint
    catches-address-bug: Ein Test bemerkt, wenn die Bestätigung die falsche Adresse zeigt
---

# UI-Tests mit Playwright

Unit- und Komponententests prüfen einzelne Teile. Ob die App als Ganzes funktioniert, zeigen sie nicht: Ist das Routing richtig verdrahtet? Kommt der Klick wirklich beim Server an? Das prüfen **UI-Tests**, auch **End-to-End-Tests** (E2E) genannt. Sie starten die fertige App in einem echten Browser und bedienen sie wie ein Nutzer: Seite öffnen, Feld ausfüllen, klicken, Ergebnis lesen.

| Art | Prüft | Geschwindigkeit | Anzahl |
|---|---|---|---|
| Unit-Test | eine Funktion oder einen Service | Millisekunden | viele |
| Komponententest | eine Komponente mit ihrem Template | Millisekunden | einige |
| UI-Test | die ganze App im Browser | Sekunden | wenige, für die wichtigsten Abläufe |

## Playwright einrichten

Das verbreitetste Werkzeug dafür ist **Playwright**. Es steuert Chromium, Firefox und WebKit (Safari). Eingerichtet wird es im Projektordner mit:

```bash
npm init playwright@latest
```

Das legt eine `playwright.config.ts` und einen Ordner für die Tests an. In der Konfiguration steht, wie Playwright die App startet und unter welcher Adresse sie läuft:

```ts
export default defineConfig({
  testDir: './e2e',
  use: { baseURL: 'http://localhost:4200' },
  webServer: { command: 'npm run start', url: 'http://localhost:4200' },
});
```

`npx playwright test` startet dann den Dev-Server, führt alle Tests in allen Browsern aus und beendet den Server wieder.

> [!NOTE]
> Auch `ng e2e` bietet beim ersten Aufruf an, ein E2E-Werkzeug einzurichten, zum Beispiel Playwright oder Cypress.

## Ein erster Test

```ts
import { expect, test } from '@playwright/test';

test('adds a task', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('New task').fill('Buy milk');
  await page.getByRole('button', { name: 'Add' }).click();

  await expect(page.getByRole('listitem')).toHaveText(['Buy milk']);
});
```

- `page` ist ein frischer Browser-Tab, für jeden Test ein neuer. Tests beeinflussen sich also nicht gegenseitig.
- `goto('/')` öffnet die App. Der Pfad wird an die `baseURL` angehängt.
- Jede Aktion gibt ein Promise zurück und braucht ein `await`.

## Elemente finden wie ein Nutzer

**Locators** beschreiben, wie Playwright ein Element findet. Am besten so, wie ein Mensch es beschreiben würde:

| Locator | Findet |
|---|---|
| `getByRole('button', { name: 'Add' })` | Elemente nach Rolle und Beschriftung, z. B. Buttons, Links, Überschriften |
| `getByLabel('Email')` | Formularfelder über ihr Label |
| `getByText('Nothing to do')` | Elemente mit diesem Text |
| `getByPlaceholder('Search')` | Felder über ihren Platzhalter |
| `getByTestId('cart')` | Elemente mit `data-testid="cart"`, wenn nichts anderes passt |

Ein Locator sucht erst, wenn du ihn benutzt, und immer neu. Du kannst ihn also einmal in eine Variable legen und mehrfach verwenden. Mit `first()`, `nth(1)` und `filter({ hasText: '…' })` grenzt du Treffer ein.

> [!TIP]
> `getByRole()` und `getByLabel()` sind die beste Wahl. Sie brechen nicht, wenn sich CSS-Klassen oder die Verschachtelung ändern, und sie finden ein Element nur, wenn es auch für Screenreader richtig beschriftet ist. Gute UI-Tests prüfen so nebenbei die Barrierefreiheit.

## Automatisches Warten

Eine App lädt Daten, rendert nach, zeigt Animationen. Playwright wartet deshalb **automatisch**:

- Vor einer Aktion wie `click()` wartet es, bis das Element da, sichtbar und aktiviert ist.
- Assertions mit `await expect(locator)` prüfen immer wieder, bis die Bedingung stimmt, standardmäßig bis zu 5 Sekunden.

```ts
await expect(page.getByRole('status')).toHaveText('1 open');      // ganzer Text
await expect(page.getByRole('status')).toContainText('open');     // Teil des Textes
await expect(page.getByRole('listitem')).toHaveCount(2);
await expect(page.getByRole('alert')).toBeHidden();
await expect(page).toHaveURL('/products');
```

> [!WARNING]
> Zwei typische Fehler machen Tests unzuverlässig („flaky“): feste Wartezeiten wie `page.waitForTimeout(2000)` und Prüfungen wie `expect(await locator.textContent()).toBe('…')`. Die zweite liest den Text genau einmal und wartet nicht. Nutze immer `await expect(locator).toHaveText(…)`.

::tryit{testing-e2e}

> [!NOTE]
> In der Vorschau kann kein echter Browser gestartet werden. Ein kleiner Nachbau von Playwright führt dieselben Tests aus und steuert die App in einem Rahmen unter den Ergebnissen. Er kennt die wichtigsten Locators, Aktionen und Assertions und wartet nur 1,5 statt 5 Sekunden.

## Den Server ersetzen

UI-Tests sprechen normalerweise mit dem echten Backend. Für Fehlerfälle oder feste Testdaten kannst du Anfragen abfangen und selbst beantworten:

```ts
test('shows an error when loading fails', async ({ page }) => {
  await page.route('**/api/products', (route) => route.fulfill({ status: 500 }));
  await page.goto('/products');
  await expect(page.getByRole('alert')).toHaveText('Could not load products.');
});
```

## Hilfreiche Werkzeuge

- `npx playwright test --ui` öffnet den **UI-Modus**: Tests einzeln starten und jeden Schritt mit Bildschirmfoto ansehen.
- `npx playwright codegen localhost:4200` öffnet einen Browser und schreibt deine Klicks als Testcode mit.
- `npx playwright show-report` zeigt den Bericht des letzten Laufs, mit Fehlern und Spuren (*Traces*) fehlgeschlagener Tests.

> [!TIP]
> Teste mit UI-Tests die wichtigsten Wege durch die App: anmelden, etwas suchen, bestellen. Sonderfälle wie jede einzelne Validierungsregel prüfst du schneller in Unit- und Komponententests.

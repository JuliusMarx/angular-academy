# Angular Academy

Eine interaktive Lernplattform für Angular, ähnlich wie W3Schools: kurze Lektionen, Codebeispiele zum Ausprobieren direkt im Browser und Quizze mit sofortigem Feedback. Inhalte auf Deutsch und Englisch.

Konzept und Roadmap: [CONCEPT.md](CONCEPT.md)

## Entwicklung

Voraussetzung: Node.js ≥ 24.15 (bzw. ≥ 22.22.3).

```bash
npm install
npm start          # Dev-Server auf http://localhost:4200
npm test           # Unit-Tests (Vitest)
npm run build      # Statischer Build mit vorgerenderten Seiten → dist/angular-academy/browser
npm run e2e        # Plattform-Tests (Playwright) gegen den Build, vorher npm run build
```

`npm start`, `npm test` und `npm run build` erzeugen vorher automatisch die Inhalte (`npm run content`). Während der Dev-Server läuft, nach Änderungen an `content/` oder `examples/` einfach `npm run content` erneut ausführen.

## Deployment

**Vor dem Veröffentlichen:** Impressum und Datenschutzerklärung (`/de/imprint`, `/de/privacy`) lesen ihre Angaben aus `src/app/core/site.ts` (`operator`). Dort stehen Platzhalter, die ausgefüllt werden müssen. Wer etwas einbaut, das externe Inhalte lädt oder Daten speichert, ergänzt die Datenschutzerklärung (`src/app/pages/legal/privacy-page.html`).

Die Seite läuft auf Netlify. Die Konfiguration steht in [netlify.toml](netlify.toml): Build-Befehl, Ausgabeordner, Node-Version, Weiterleitungen (Startseite je nach Browsersprache auf `/de` oder `/en`) und Header. Jeder Push auf `main` wird automatisch veröffentlicht, Pull Requests bekommen einen Vorschau-Link.

Lokal testen, inklusive der Netlify-Regeln:

```bash
npm run build
npx netlify-cli dev --offline --dir dist/angular-academy/browser
```

## Projektstruktur

```
content/<sprache>/<NN-kapitel>/
  _chapter.md              # Kapitel-Titel, -Beschreibung und Frage für den Einstufungstest (Frontmatter)
  <NN-lektion>.md          # Lektion: Markdown + Frontmatter (title, minutes, summary, quiz)
examples/
  _base/                   # Gemeinsames Angular-Projekt für alle Live-Beispiele
  <beispiel-id>/           # Dateien, die _base überschreiben/ergänzen (+ optional meta.json)
scripts/build-content.mjs  # Markdown → TypeScript-Module in src/app/content/generated/
src/app/
  content/                 # Datenmodell + ContentService
  core/                    # Fortschritt (localStorage), Theme, UI-Texte DE/EN
  layout/                  # Shell, Header, Sidebar
  pages/                   # Startseite, Lektion (inkl. Quiz und Live-Editor), 404
```

## Eine Lektion schreiben

```markdown
---
title: Meine Lektion
minutes: 6
summary: |-               # Pflicht: Kurzfassung für die Ansicht „Kurz“
  - 4–7 Kernpunkte mit `Code`, danach meist ein kurzer Codeblock
quiz:
  - question: Frage?
    options: [A, B, C]
    answer: 1              # Index der richtigen Antwort
    explanation: Erklärung, darf `Markdown` enthalten.
---

# Meine Lektion

Text mit `Code`, Tabellen und Codeblöcken (```ts, ```html, ```bash …).

> [!TIP]
> Hinweisboxen: NOTE, TIP, WARNING

::tryit{beispiel-id}
```

- Ordner- und Dateinamen bestimmen URL und Reihenfolge (`02-templates/01-interpolation.md` → `/de/templates/interpolation`). Sie müssen in allen Sprachen gleich sein.
- `::tryit{id}` bettet das Beispiel aus `examples/<id>/` als echtes Angular-Projekt (StackBlitz) ein.
- Die Beispiele laufen auf **Angular 21** (`examples/_base/package.json`), weil die Build-Toolchain von Angular 22 (rolldown/oxc) in StackBlitz-WebContainern nicht startet. Vor einem Upgrade in StackBlitz testen.
- Daten für HTTP-Beispiele liegen als JSON in `examples/<id>/public/` (z. B. `public/api/products.json` → `GET /api/products.json`). Der Dev-Server liefert sie aus, fehlende Dateien ergeben 404. Für alles, was ein statischer Server nicht kann (Header prüfen, POST), einen Fake-Backend-Interceptor verwenden, siehe `examples/ex-interceptor`.
- Die Einbettung braucht Cross-Origin-Isolation (`Cross-Origin-Opener-Policy: same-origin`, `Cross-Origin-Embedder-Policy: credentialless`), gesetzt in `netlify.toml` und für `npm start` in `angular.json`. Externe Ressourcen auf der Plattform selbst (Bilder, Skripte) werden deshalb ohne Cookies geladen.
- Jede Lektion muss in allen Sprachen existieren, sonst bricht `npm run content` ab.
- Der Einstufungstest (`/de/placement`) stellt pro Kapitel eine Quizfrage, ausgewählt in `_chapter.md` mit `placement: { lesson: <lektion>, question: <index> }`. Wer sie richtig beantwortet, kann das ganze Kapitel als erledigt markieren. Die Frage sollte also den Kern des Kapitels abfragen.
- Tabellen brauchen in jeder Kopfzelle Text (leere Kopfzellen sind ein axe-Fehler). Quiztexte können nur Inline-Code, kein Fett. `npm run content` bricht in beiden Fällen ab.
- Frontmatter-Werte mit ` #`, `: `, `{`, `[` oder Backticks am Anfang in Anführungszeichen setzen, sonst liest YAML sie falsch (` #` startet z. B. einen Kommentar).

## Eine Übung schreiben

Eine Übung ist ein Beispielprojekt mit Startcode, Prüfungen und Lösung:

```
examples/ex-<name>/
  meta.json                  # { "exercise": true, "openFile": "…" }
  src/app/…                  # Startcode mit TODO-Kommentaren
  src/exercise/checks.ts     # Prüfungen (siehe unten)
  solution/src/app/…         # Lösung – wird auf der Seite angezeigt, nicht ins Projekt kopiert
```

Beim Bauen bekommt jede Übung zusätzlich das Prüf-Kit aus `examples/_exercise-kit/` und startet mit `ng serve --no-hmr`. So lädt die Vorschau nach jedem Speichern neu, führt die Prüfungen gegen die laufende App aus und meldet das Ergebnis per `postMessage` an die Kursseite.

```ts
// src/exercise/checks.ts
import { Check } from './check-kit';

export const exercise = 'ex-<name>';

export const checks: Check[] = [
  {
    id: 'squared-updates',
    run: async (t) => {
      await t.click(t.button('+'));
      t.expectText('#squared', '1');
    },
  },
];
```

In der Lektion verweist das Frontmatter auf die Übung und beschriftet jede Prüfung:

```yaml
exercise:
  example: ex-<name>
  title: Quadrat und Reset
  task: |
    Markdown mit der Aufgabe …
  checks:
    squared-updates: Nach **+** zeigt es 1
```

`npm run content` bricht ab, wenn Prüf-IDs in `checks.ts` und Frontmatter nicht übereinstimmen.

**Vor dem Commit prüfen:** Der Startcode muss mindestens eine Prüfung verfehlen und die Lösung alle bestehen.

### Test-Beispiele und Test-Übungen

Mit `"kit": "test"` in `meta.json` startet die Vorschau nicht die App, sondern führt die Specs aus (`examples/_test-kit/`). Ein kleiner Runner stellt `describe`, `it`, `expect`, `beforeEach`/`afterEach` und `vi.fn()`/`vi.spyOn()` bereit und nutzt Angulars echtes `TestBed`. Die Specs sehen daher aus wie in einem CLI-Projekt mit Vitest. Welche Spec-Dateien laufen, steht in `src/specs.ts` des Beispiels.

Test-Übungen (`"kit": "test", "exercise": true`) prüfen die Tests der Lernenden per **Mutationstest** (`examples/_test-exercise-kit/`):

- `t.runTests()` lässt die Tests gegen den echten Code laufen. Sie sollen alle bestehen.
- `t.expectCaught([[Original, Mutant]], 'Meldung')` lässt sie gegen eine absichtlich kaputte Variante aus `src/exercise/mutants.ts` laufen. Mindestens ein Test muss dann fehlschlagen.
- Services werden per `TestBed.overrideProvider` ersetzt, Komponenten über `TestBed.createComponent`. Komponenten-Mutanten brauchen ein eigenes `@Component` mit statisch auswertbarem Template.

### UI-Test-Beispiele und -Übungen (Playwright)

Mit `"kit": "e2e"` führt die Vorschau Playwright-Tests aus `e2e/*.spec.ts` aus (`examples/_e2e-kit/`). `@playwright/test` ist per `paths` in der `tsconfig.json` auf einen kleinen Nachbau (`src/testing/playwright.ts`) umgeleitet: `test`, `test.describe`/`beforeEach`, `page.goto`, die `getBy…`-Locators, Aktionen (`click`, `fill`, `press`, `check`) und die wichtigsten `expect`-Assertions mit automatischem Warten (1,5 s). Jeder Test öffnet die App frisch in einem iframe. Am `window.name` des Frames erkennt `main.ts`, dass es die App starten soll statt der Tests. Welche Specs laufen, steht in `src/specs.ts`.

Übungen (`"kit": "e2e", "exercise": true`, `examples/_e2e-exercise-kit/`) arbeiten ebenfalls mit Mutanten: `t.expectCaught('NameDesMutanten', 'Meldung')` startet im Frame statt `App` die gleichnamige Root-Komponente aus `src/exercise/mutants.ts` und bricht beim ersten fehlschlagenden Test ab.

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
```

`npm start`, `npm test` und `npm run build` erzeugen vorher automatisch die Inhalte (`npm run content`). Während der Dev-Server läuft, nach Änderungen an `content/` oder `examples/` einfach `npm run content` erneut ausführen.

## Deployment

Die Seite läuft auf Netlify. Die Konfiguration steht in [netlify.toml](netlify.toml): Build-Befehl, Ausgabeordner, Node-Version, Weiterleitungen (Startseite je nach Browsersprache auf `/de` oder `/en`) und Header. Jeder Push auf `main` wird automatisch veröffentlicht, Pull Requests bekommen einen Vorschau-Link.

Lokal testen, inklusive der Netlify-Regeln:

```bash
npm run build
npx netlify-cli dev --offline --dir dist/angular-academy/browser
```

## Projektstruktur

```
content/<sprache>/<NN-kapitel>/
  _chapter.md              # Kapitel-Titel und -Beschreibung (Frontmatter)
  <NN-lektion>.md          # Lektion: Markdown + Frontmatter (title, minutes, quiz)
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
- Die Einbettung braucht Cross-Origin-Isolation (`Cross-Origin-Opener-Policy: same-origin`, `Cross-Origin-Embedder-Policy: credentialless`), gesetzt in `netlify.toml` und für `npm start` in `angular.json`. Externe Ressourcen auf der Plattform selbst (Bilder, Skripte) werden deshalb ohne Cookies geladen.
- Jede Lektion muss in allen Sprachen existieren, sonst bricht `npm run content` ab.
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

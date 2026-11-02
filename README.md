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

# Angular Academy – Konzept

## 1. Vision

Eine interaktive Lernplattform für Angular im Stil von W3Schools: kurze, gut strukturierte Lektionen, zu jedem Thema ein **„Try it yourself“** mit echtem Angular im Browser und kleine Übungen mit direktem Feedback.

## 2. Eckpunkte

| Thema | Entscheidung |
|---|---|
| Zielgruppe | Entwickler mit JavaScript-/TypeScript-Grundlagen, Fokus komplett auf Angular |
| Live-Editor | Echtes Angular im Browser über StackBlitz WebContainers (`@stackblitz/sdk`) |
| Fortschritt | Nur im Browser (`localStorage`), kein Backend, kein Login |
| Sprache | Deutsch und Englisch (i18n) von Anfang an |
| Hosting | Statische Seite (Netlify oder Cloudflare Pages; GitHub Pages braucht bei privaten Repos GitHub Pro) |

## 3. Nutzererlebnis

### Seitenaufbau (pro Lektion)
```
┌──────────────┬────────────────────────────────────────┐
│ Navigation   │  Lektion: "Signals"                    │
│              │  Erklärtext, Codebeispiele             │
│ ▸ Grundlagen │                                        │
│ ▾ Signals ✓  │  ┌──────────────────────────────────┐  │
│   • signal() │  │ [ Try it yourself ▶ ]            │  │
│   • computed │  └──────────────────────────────────┘  │
│ ▸ Routing    │                                        │
│              │  Quiz (2–3 Fragen)                     │
│ Fortschritt  │                                        │
│ ███████░ 70% │  ◀ Zurück                  Weiter ▶   │
└──────────────┴────────────────────────────────────────┘
```

### Kernfunktionen
1. **Lektionen**: Markdown-Inhalte mit Syntax-Highlighting, Hinweis-/Warnboxen und Copy-Button.
2. **Try it yourself**: Öffnet das passende Beispielprojekt eingebettet in StackBlitz (Editor + Vorschau). Jedes Beispiel ist ein kleines, eigenständiges Angular-Projekt.
3. **Quiz**: Multiple Choice / Lückentext am Ende jeder Lektion, wird sofort ausgewertet.
4. **Übungen** (Phase 2): Starter-Code mit Aufgabe, Lösung wird über versteckte Tests im WebContainer geprüft.
5. **Fortschritt**: Abgeschlossene Lektionen, Quiz-Ergebnisse und die zuletzt besuchte Lektion werden lokal gespeichert, dazu Fortschrittsbalken pro Kapitel.
6. **Suche**: Volltextsuche über alle Lektionen (clientseitig, z. B. mit MiniSearch).
7. **Sprachumschalter** DE/EN und Dark Mode.

## 4. Lehrplan (Entwurf)

1. **Einführung**: Was ist Angular, Angular CLI, Projektstruktur, erste Komponente
2. **Komponenten & Templates**: Interpolation, Property-/Event-Binding, Control Flow (`@if`, `@for`, `@switch`), `@defer`
3. **Signals**: `signal`, `computed`, `effect`, `linkedSignal`, `resource`
4. **Komponenten-Kommunikation**: `input()`, `output()`, `model()`, Content Projection
5. **Direktiven & Pipes**: eingebaute und eigene
6. **Services & Dependency Injection**: `inject()`, Provider, Hierarchie
7. **Routing**: Routen, Parameter, Lazy Loading, Guards, Resolver
8. **Forms**: Template-driven, Reactive Forms, Signal Forms, Validierung
9. **HTTP**: `HttpClient`, `httpResource`, Interceptors, Fehlerbehandlung
10. **RxJS-Grundlagen für Angular**: Observables, wichtige Operatoren, Interop mit Signals
11. **Testing**: Unit-Tests für Komponenten und Services
12. **Fortgeschritten**: Zoneless, Performance, SSR & Hydration, Architektur

Jede Lektion: ca. 5–10 Minuten Lesezeit, mindestens 1 Live-Beispiel, 2–3 Quizfragen.

## 5. Technische Architektur

### Stack
- **Angular** (aktuelle Version): Standalone Components, Signals, zoneless, neuer Control Flow
- **Prerendering (SSG)** über `@angular/ssr` für schnelle Ladezeiten und SEO
- **Styling**: SCSS mit CSS-Custom-Properties (Theming/Dark Mode); ggf. Angular CDK für Barrierefreiheit
- **Markdown-Rendering**: `marked` + `shiki` (Highlighting) zur Build-Zeit, siehe `scripts/build-content.mjs`
- **Live-Editor**: `@stackblitz/sdk` (`embedProject`), Projektdateien kommen aus dem Repo
- **UI-Übersetzung**: kleines eigenes Wörterbuch (`src/app/core/ui-text.ts`), die Sprache steckt in der URL. Bei vielen UI-Texten ggf. später Transloco.
- **Tests**: Vitest (Unit), später Playwright (E2E)

### Inhalte als Dateien im Repo
Inhalte und App-Code sind getrennt, damit Lektionen ohne Angular-Wissen über die App gepflegt werden können:

```
content/
  de/
    02-templates/
      01-interpolation.md      # Frontmatter: title, order, quiz, example
  en/
    02-templates/
      01-interpolation.md
examples/
  templates-interpolation/     # kleines Angular-Projekt für StackBlitz
    src/main.ts
    src/app/app.component.ts
quizzes/
  templates-interpolation.json # sprachneutrale IDs, Texte pro Sprache
src/                           # die Angular-App selbst
```

- Ein Build-Skript liest `content/` ein und erzeugt daraus Navigation, Suchindex und die Routen fürs Prerendering.
- Beispielprojekte sind sprachneutral (Code auf Englisch), nur Erklärtexte werden übersetzt.
- URL-Schema: `/de/templates/interpolation`, `/en/templates/interpolation`

### Fortschritt (localStorage)
```ts
interface Progress {
  version: 1;
  completedLessons: string[];        // Lektions-IDs
  quizResults: Record<string, { score: number; total: number; date: string }>;
  lastLesson?: string;
}
```
Ein `ProgressService` kapselt den Zugriff (Signal-basiert), sodass ein Backend später nur dort angeschlossen werden muss. Mit Export/Import als JSON kann man den Fortschritt auf ein anderes Gerät mitnehmen.

## 6. Roadmap

### Phase 1 – MVP
- Projekt-Setup (Angular, Linting, CI mit GitHub Actions, Deployment)
- Layout: Navigation, Lektionsseite, Sprachumschalter, Dark Mode
- Content-Pipeline (Markdown → Seiten, Navigation)
- StackBlitz-Einbettung
- Quiz-Komponente + Fortschritt
- **Kapitel 1–3** komplett auf DE und EN

### Phase 2 – Ausbau
- Übungen mit automatischer Prüfung
- Suche
- Kapitel 4–8

### Phase 3 – Vertiefung
- Kapitel 9–12
- Optional: Login + Cloud-Sync (z. B. Supabase), Abschlusszertifikat
- Optional: Mehr Interaktivität (Schritt-für-Schritt-Tutorials im Editor)

## 7. Offene Fragen
- ~~Live-Editor eingebettet~~ – gelöst: COOP/COEP-Header plus `crossOriginIsolated: true` im SDK; Beispiele auf Angular 21, da Angular 22 in WebContainern nicht startet.
- Hosting-Anbieter festlegen (Netlify vs. Cloudflare Pages) und ggf. eigene Domain
- Name/Branding und Logo
- Wer schreibt die Inhalte: komplett von Claude entworfen und von dir geprüft, oder gemischt?
- Lizenz für die Inhalte (z. B. CC BY-SA) und den Code (z. B. MIT), falls das Repo später öffentlich wird

---
title: Was ist Angular?
minutes: 5
summary: |-
  - Angular ist ein Framework von Google und bringt alles für eine komplette App mit: Komponenten, Signals, Router, Forms, `HttpClient`, Dependency Injection und die Angular CLI.
  - Angular-Projekte schreibst du in TypeScript.
  - Ein neues Projekt legst du mit der CLI an; `npm start` startet die App unter `http://localhost:4200`.
  - `src/main.ts` startet die App mit `bootstrapApplication()`, `src/app/app.ts` ist die Wurzelkomponente.
  - Globale Konfiguration (Router, HTTP, …) steht in `src/app/app.config.ts`, die CLI-Konfiguration in `angular.json`.

  ```bash
  npx @angular/cli@latest new mein-projekt
  cd mein-projekt
  npm start
  ```
quiz:
  - question: Welche Sprache verwendet Angular standardmäßig?
    options: [JavaScript, TypeScript, Dart, Python]
    answer: 1
    explanation: Angular-Projekte werden in TypeScript geschrieben. Das bringt Typprüfung und gute Editor-Unterstützung.
  - question: Mit welchem Befehl legst du ein neues Angular-Projekt an?
    options: [npm create angular, ng init, ng new mein-projekt, angular start]
    answer: 2
    explanation: "`ng new` aus der Angular CLI erzeugt ein komplettes, lauffähiges Projekt."
---

# Was ist Angular?

**Angular** ist ein Framework von Google, mit dem du moderne Web-Anwendungen baust – von kleinen Apps bis zu großen Unternehmensanwendungen. Anders als eine reine UI-Bibliothek bringt Angular alles mit, was du für eine komplette Anwendung brauchst:

- **Komponenten** für den Aufbau der Oberfläche
- **Signals** für reaktiven Zustand
- **Router** für die Navigation zwischen Seiten
- **Forms** für Formulare mit Validierung
- **HttpClient** für die Kommunikation mit Servern
- **Dependency Injection** für sauber getrennten, testbaren Code
- **Angular CLI** zum Erzeugen, Bauen und Testen von Projekten

> [!NOTE]
> Dieser Kurs setzt voraus, dass du die Grundlagen von JavaScript bzw. TypeScript kennst: Variablen, Funktionen, Klassen, Arrays und Module mit `import`/`export`.

## Angular installieren

Du brauchst eine aktuelle Version von [Node.js](https://nodejs.org). Danach legst du mit der Angular CLI ein neues Projekt an:

```bash
npx @angular/cli@latest new mein-projekt
cd mein-projekt
npm start
```

Anschließend läuft deine App unter `http://localhost:4200`. Jede Änderung im Code wird sofort im Browser sichtbar.

## Der Aufbau eines Projekts

Die wichtigsten Dateien in einem neuen Projekt:

| Datei | Zweck |
|---|---|
| `src/main.ts` | Startpunkt: startet die Anwendung mit `bootstrapApplication()` |
| `src/index.html` | Die HTML-Seite, in die Angular die App rendert |
| `src/app/app.ts` | Die Wurzelkomponente deiner App |
| `src/app/app.config.ts` | Globale Konfiguration (Router, HTTP, …) |
| `src/styles.css` | Globale Styles (oder `.scss`, je nach Projekt) |
| `angular.json` | Konfiguration der Angular CLI |

> [!TIP]
> Für diesen Kurs musst du Angular nicht lokal installieren. Jede Lektion mit einem **Ausprobieren**-Button startet ein echtes Angular-Projekt direkt in deinem Browser.

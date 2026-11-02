---
title: Die Angular CLI
minutes: 6
quiz:
  - question: Welcher Befehl erzeugt eine neue Komponente namens user-card?
    options: [ng new user-card, ng generate component user-card, ng create user-card, ng add user-card]
    answer: 1
    explanation: "`ng generate component` – kurz `ng g c` – legt TypeScript-Datei, Template, Styles und Test an."
  - question: Wofür ist ng serve da?
    options:
      - Es baut die App für die Produktion
      - Es startet einen Entwicklungsserver mit automatischem Neuladen
      - Es veröffentlicht die App im Internet
      - Es führt die Tests aus
    answer: 1
  - question: Was macht ng update?
    options:
      - Es aktualisiert Angular-Pakete und passt deinen Code automatisch an
      - Es lädt die Seite im Browser neu
      - Es aktualisiert nur die package.json
      - Es installiert die neueste Node.js-Version
    answer: 0
    explanation: "`ng update` führt Migrationen aus, die deinen Code an neue Versionen anpassen."
---

# Die Angular CLI

Die **Angular CLI** (Command Line Interface) ist dein wichtigstes Werkzeug im Alltag. Mit ihr legst du Projekte an, erzeugst Code, startest den Entwicklungsserver und baust die App für die Produktion. Alle Befehle beginnen mit `ng`.

## Die wichtigsten Befehle

| Befehl | Kurzform | Was er macht |
|---|---|---|
| `ng new <name>` | | Neues Projekt anlegen |
| `ng serve` | `npm start` | Entwicklungsserver starten (mit automatischem Neuladen) |
| `ng generate component <name>` | `ng g c <name>` | Neue Komponente erzeugen |
| `ng build` | | App für die Produktion bauen (Ordner `dist/`) |
| `ng test` | | Unit-Tests ausführen |
| `ng add <paket>` | | Bibliothek installieren und einrichten |
| `ng update` | | Angular auf eine neue Version aktualisieren |

## Code erzeugen mit ng generate

Statt Dateien von Hand anzulegen, lässt du sie von der CLI erzeugen:

```bash
ng generate component user-card
```

Die CLI legt dafür einen Ordner mit vier Dateien an:

```bash
src/app/user-card/
  user-card.ts        # Klasse mit @Component
  user-card.html      # Template
  user-card.css       # Styles (oder .scss, je nach Projekt)
  user-card.spec.ts   # Unit-Test
```

Genauso funktioniert das für andere Bausteine, die du später kennenlernst:

```bash
ng g service auth       # Service
ng g directive tooltip  # Direktive
ng g pipe currency-eur  # Pipe
ng g guard admin        # Router-Guard
```

> [!TIP]
> Mit `--dry-run` siehst du, welche Dateien erzeugt würden, ohne dass etwas geschrieben wird: `ng g c user-card --dry-run`.

## Bauen für die Produktion

```bash
ng build
```

Das Ergebnis landet im Ordner `dist/`. Die CLI optimiert dabei automatisch: Sie entfernt ungenutzten Code, minimiert die Dateien und teilt die App in kleine Pakete auf, die erst bei Bedarf geladen werden. Den Inhalt von `dist/` kannst du auf jeden Webserver hochladen.

## Angular aktuell halten

Angular erscheint etwa alle sechs Monate in einer neuen Hauptversion. Mit `ng update` aktualisierst du dein Projekt:

```bash
ng update @angular/core @angular/cli
```

Dabei laufen automatische **Migrationen**, die deinen Code an Änderungen anpassen.

> [!NOTE]
> Aktualisiere immer nur um eine Hauptversion auf einmal, zum Beispiel von 21 auf 22. Der Update-Guide auf [angular.dev/update-guide](https://angular.dev/update-guide) zeigt dir die einzelnen Schritte.

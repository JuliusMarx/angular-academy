---
title: Change Detection und Zoneless
minutes: 8
quiz:
  - question: "Ein normales Feld wird in einem `setTimeout` geändert. Was passiert in einer Zoneless-App?"
    options:
      - Die Seite aktualisiert sich sofort
      - Die Änderung erscheint erst, wenn etwas anderes eine Aktualisierung auslöst
      - Angular wirft einen Fehler
      - Der Timer läuft nicht
    answer: 1
  - question: Was löst in einer Zoneless-App eine Aktualisierung aus?
    options:
      - Jeder Timer und jedes Promise
      - Geänderte Signals, die das Template liest, und Events mit Angular-Handler
      - Nur ein Neuladen der Seite
      - Nur `ngOnInit`
    answer: 1
  - question: "Was bedeutet `ChangeDetectionStrategy.OnPush`?"
    options:
      - Die Komponente wird nie aktualisiert
      - Die Komponente wird nur geprüft, wenn sich ihre Inputs, gelesene Signals oder eigene Events ändern
      - Die Komponente wird bei jedem Timer geprüft
      - Die Komponente rendert nur auf dem Server
    answer: 1
exercise:
  example: ex-zoneless
  title: Ein Countdown, der sich bewegt
  task: |-
    Der Countdown zählt im Hintergrund herunter, und das Wetter wird „geladen“. Auf der Seite passiert aber nichts.

    Mach aus `countdown` und `weather` Signals. Ändere sie mit `set()` oder `update()` und lies sie im Template mit `()`.
  checks:
    countdown-updates: Der Countdown zählt sichtbar herunter, ohne Klick
    liftoff: Bei 0 erscheint „Liftoff!“
    weather-updates: Nach dem Laden zeigt das Wetter „Clear skies“
---

# Change Detection und Zoneless

**Change Detection** ist der Mechanismus, mit dem Angular das DOM an deine Daten anpasst. Die entscheidende Frage dabei: Woher weiß Angular, *wann* sich etwas geändert hat?

## Früher: Zone.js

Lange Zeit hat die Bibliothek **Zone.js** jede asynchrone Browser-Funktion überwacht: Timer, Promises, Events, HTTP. Nach jeder davon prüfte Angular sicherheitshalber die ganze App, ob sich etwas geändert hat. Das war bequem, aber teuer: Viele dieser Prüfungen waren umsonst, und Zone.js selbst machte die App größer und schwerer zu debuggen.

## Heute: Zoneless

Neue Angular-Apps laufen **ohne Zone.js**. Angular aktualisiert die Seite nur noch, wenn es einen konkreten Grund dafür gibt:

- ein **Signal**, das ein Template liest, hat sich geändert,
- ein **Event** mit Angular-Handler wurde ausgelöst, z. B. `(click)`,
- ein Input hat sich geändert, oder du hast `markForCheck()` aufgerufen.

Das hat eine wichtige Folge: Änderst du ein **normales Feld** in einem Timer oder Callback, bekommt Angular das nicht mit.

```ts
protected plainCount = 0;
protected readonly signalCount = signal(0);

setTimeout(() => this.plainCount++, 1000);                 // Seite bleibt alt
setTimeout(() => this.signalCount.update((n) => n + 1), 1000); // Seite aktualisiert sich
```

::tryit{cd-zoneless}

Probier es aus: Nach dem Timer zeigt nur das Signal den neuen Wert. Das Feld erscheint erst, wenn du den Button mit dem leeren Handler klickst. Ein Klick auf ein Element **ohne** Angular-Handler löst übrigens nichts aus.

> [!TIP]
> Die Faustregel ist einfach: **Alles, was sich ändert und angezeigt wird, gehört in ein Signal.** Dann musst du über Change Detection gar nicht nachdenken.

## OnPush

Komponenten können mit `ChangeDetectionStrategy.OnPush` angeben, dass Angular sie nur prüfen soll, wenn

- sich einer ihrer Inputs ändert,
- ein Signal, das ihr Template liest, sich ändert, oder
- in ihr ein Event ausgelöst wird.

Alle anderen Aktualisierungen der App überspringen die Komponente und ihre Kinder. Mit Signals ist das ohne Nachteil, deshalb ist **OnPush seit Angular 22 der Standard**. In Angular 21, wo die Live-Beispiele laufen, prüft Angular bei jeder Aktualisierung noch alle Komponenten. Für Code mit Signals macht das keinen Unterschied.

> [!NOTE]
> Bestehende Apps mit Zone.js laufen weiter. Beim Umstieg auf Zoneless suchst du nach Stellen, die normale Felder in Timern, Promises oder Callbacks ändern, und machst daraus Signals. Den Rest übernimmt Angular.

---
title: Performance
minutes: 9
quiz:
  - question: "Warum ist `computed()` im Template besser als ein Methodenaufruf wie `visible()`?"
    options:
      - Methoden sind im Template verboten
      - "`computed()` merkt sich das Ergebnis und rechnet nur neu, wenn sich seine Signals ändern"
      - "`computed()` läuft auf dem Server"
      - Es gibt keinen Unterschied
    answer: 1
  - question: "Was bewirkt `track p.id` in einer `@for`-Schleife?"
    options:
      - Es sortiert die Liste nach der ID
      - Angular erkennt jedes Element wieder und erzeugt nur geänderte DOM-Elemente neu
      - Es filtert doppelte Einträge
      - Es lädt die Liste nach und nach
    answer: 1
  - question: "Was macht `@defer (on viewport)`?"
    options:
      - Der Inhalt wird ausgeblendet
      - Code und Inhalt des Blocks werden erst geladen, wenn der Platzhalter sichtbar wird
      - Der Block rendert nur auf dem Server
      - Der Block wird alle paar Sekunden neu geladen
    answer: 1
exercise:
  example: ex-performance
  title: Eine schnelle Produktliste
  task: |-
    Die Liste funktioniert, macht aber zu viel Arbeit:

    1. Mach aus der Methode `visible()` ein `computed()`. Dann filtert sie nicht bei jedem Klick auf ❤ neu.
    2. Tracke die Produkte in `@for` über ihre `id` statt über die Position (`$index`).
  checks:
    filter-works: Der Filter zeigt weiterhin die passenden Produkte
    no-needless-filtering: "Klicks auf ❤ lösen kein neues Filtern aus"
    track-by-id: Ein neues Produkt oben lässt die vorhandenen Elemente bei ihren Produkten
---

# Performance

Angular-Apps sind von Haus aus schnell. Langsam werden sie meist durch ein paar typische Muster: Arbeit, die bei jeder Aktualisierung wiederholt wird, DOM-Elemente, die unnötig neu entstehen, und Code, der geladen wird, bevor ihn jemand braucht.

## Rechnen nur bei Bedarf: computed

Eine Methode im Template läuft bei **jeder** Aktualisierung der Komponente, egal ob sich ihre Daten geändert haben:

```html
@for (p of visible(); track p.id) { … }  <!-- visible() als Methode: läuft bei jedem Klick -->
```

Ein `computed()` merkt sich sein Ergebnis und rechnet nur neu, wenn sich eines der Signals ändert, die es liest:

```ts
protected readonly visible = computed(() => filterProducts(this.products(), this.query()));
```

::tryit{perf-list}

Klicke im Beispiel auf ❤: Der Zähler „The filter ran … times“ bleibt stehen. Mit einer Methode stiege er bei jedem Klick, im Entwicklungsmodus sogar doppelt, weil Angular dort zur Kontrolle ein zweites Mal prüft.

## Listen: track

`track` sagt Angular, woran es ein Element der Liste wiedererkennt. Mit einer stabilen ID wie `track p.id` werden bei Änderungen nur die betroffenen DOM-Elemente erzeugt oder entfernt. Die anderen bleiben, samt Fokus, Eingaben und laufenden Animationen.

Mit `track $index` erkennt Angular Elemente nur an ihrer **Position**. Fügst du oben etwas ein, bekommt jedes Element den Inhalt seines Nachbarn: Angular aktualisiert unnötig das ganze DOM, und Fokus oder Eingaben hängen plötzlich am falschen Eintrag.

> [!TIP]
> Nimm `track item.id` (oder einen anderen eindeutigen Schlüssel). `$index` passt nur für Listen, die sich nie umsortieren, etwa feste Menüpunkte.

## Später laden: @defer und Lazy Routes

Code, der nicht sofort gebraucht wird, muss nicht sofort geladen werden:

- **Lazy Routes** (Kapitel *Routing*) laden ganze Seiten erst beim ersten Aufruf.
- **`@defer`** (Kapitel *Templates*) macht dasselbe für Teile einer Seite:

```html
@defer (on viewport) {
  <app-reviews />
} @placeholder {
  <p>Bewertungen</p>
}
```

Angular packt `app-reviews` in eine eigene Datei. Sie wird erst geladen, wenn der Platzhalter ins Bild scrollt. Weitere Auslöser sind `on interaction`, `on idle`, `on timer(2s)` und `when bedingung`.

## Bilder: NgOptimizedImage

Bilder sind oft der größte Teil einer Seite. Die Direktive `NgOptimizedImage` hilft automatisch:

```html
<img ngSrc="/hero.jpg" width="1200" height="600" priority />
```

- Bilder unterhalb des sichtbaren Bereichs lädt sie erst bei Bedarf (lazy).
- Durch `width` und `height` springt die Seite beim Laden nicht.
- `priority` lädt das wichtigste Bild der Seite zuerst.

## Messen statt raten

Bevor du optimierst, miss:

- Die **Angular DevTools** (Browser-Erweiterung) zeigen im *Profiler*, welche Komponenten wie oft und wie lange geprüft werden.
- `ng build` meldet die Größe der Bundles. In `angular.json` setzt du Budgets, die bei zu großen Dateien warnen.
- **Lighthouse** in den Chrome DevTools bewertet Ladezeit und Interaktivität der fertigen Seite.

---
title: Später laden mit @defer
minutes: 8
quiz:
  - question: Was passiert mit dem Code einer Komponente, die nur in einem @defer-Block verwendet wird?
    options:
      - Er wird beim App-Start sofort mitgeladen
      - Er wird in eine eigene Datei ausgelagert und erst beim Auslösen geladen
      - Er wird gar nicht kompiliert
      - Er wird auf dem Server ausgeführt
    answer: 1
  - question: Welcher Block wird angezeigt, bevor das Laden überhaupt beginnt?
    options: ["@loading", "@placeholder", "@error", "@empty"]
    answer: 1
    explanation: "`@placeholder` steht da, bis der Trigger auslöst. Danach zeigt `@loading` den Ladezustand."
  - question: Mit welchem Trigger lädst du Inhalte, sobald sie in den sichtbaren Bereich gescrollt werden?
    options: ["on idle", "on hover", "on viewport", "on timer"]
    answer: 2
---

# Später laden mit @defer

Nicht alles muss sofort beim Start geladen werden. Mit `@defer` sagst du Angular: *Lade diesen Teil des Templates erst, wenn er gebraucht wird.* Angular lagert die betroffenen Komponenten dann automatisch in eine eigene JavaScript-Datei aus. Dadurch startet deine App schneller.

## Die Grundform

```html
@defer {
  <app-comments />
}
```

Ohne weitere Angabe lädt Angular den Inhalt, sobald der Browser nichts anderes zu tun hat (`on idle`).

## Platzhalter, Ladezustand und Fehler

```html
@defer (on viewport) {
  <app-comments />
} @placeholder {
  <p>Kommentare</p>
} @loading (minimum 500ms) {
  <p>Kommentare werden geladen …</p>
} @error {
  <p>Kommentare konnten nicht geladen werden.</p>
}
```

| Block | Wann er angezeigt wird |
|---|---|
| `@placeholder` | bevor der Trigger auslöst |
| `@loading` | während der Code geladen wird |
| `@error` | wenn das Laden fehlschlägt |

Mit `minimum` verhinderst du, dass ein Zustand nur kurz aufflackert.

## Trigger – wann geladen wird

| Trigger | Lädt, wenn … |
|---|---|
| `on idle` | der Browser untätig ist (Standard) |
| `on viewport` | der Platzhalter in den sichtbaren Bereich kommt |
| `on interaction` | auf den Platzhalter geklickt wird oder er eine Eingabe bekommt |
| `on hover` | die Maus über den Platzhalter fährt |
| `on timer(2s)` | die angegebene Zeit vergangen ist |
| `on immediate` | sofort nach dem ersten Rendern |
| `when bedingung()` | der Ausdruck `true` wird |

Mit `prefetch` lädst du den Code schon vorab, zeigst den Inhalt aber erst später an:

```html
@defer (on interaction; prefetch on idle) {
  <app-editor />
} @placeholder {
  <button>Editor öffnen</button>
}
```

::tryit{defer-blocks}

> [!WARNING]
> Damit eine Komponente wirklich ausgelagert wird, darf sie in derselben Datei **nur** innerhalb von `@defer`-Blöcken verwendet werden, also auch nicht in einer `viewChild()`-Abfrage.

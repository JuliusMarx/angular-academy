---
title: SSR und Hydration
minutes: 9
summary: |-
  - Mit SSR rendert Angular die Seite auf dem Server, der Browser zeigt fertiges HTML sofort an. Prerendering (SSG) rendert einmal beim Build.
  - `ng new my-app --ssr` oder `ng add @angular/ssr`. Den `RenderMode` pro Route legst du in `app.routes.server.ts` fest.
  - **Hydration** (`provideClientHydration()`) übernimmt das Server-HTML, statt es neu zu rendern. `@defer (hydrate on viewport)` hydriert inkrementell.
  - Auf dem Server gibt es kein `window`, `document` oder `localStorage`. Browser-Code gehört in `afterNextRender()` oder `afterRenderEffect()`.
  - Auch ohne SSR gibt es die Elemente einer Komponente erst nach dem Rendern im DOM.

  ```ts
  constructor() {
    afterNextRender(() => {
      this.theme.set(localStorage.getItem('theme') ?? 'light');
    });
  }
  ```

  > [!WARNING] Server und Browser müssen beim ersten Rendern dasselbe HTML erzeugen. Uhrzeit oder Zufallszahlen setzt du erst in `afterNextRender()`, sonst droht ein *Hydration Mismatch*.
quiz:
  - question: Was ist der Vorteil von Server-Side Rendering?
    options:
      - Die App braucht kein JavaScript mehr
      - Der Browser bekommt sofort fertiges HTML – schneller sichtbar und gut für Suchmaschinen
      - Die App läuft nur noch auf dem Server
      - Man braucht keine Komponenten mehr
    answer: 1
  - question: Was passiert bei der Hydration?
    options:
      - Angular löscht das HTML vom Server und rendert alles neu
      - Angular übernimmt das vorhandene HTML im Browser und hängt Events und Zustand daran
      - Der Server schickt die Daten noch einmal
      - Die Styles werden geladen
    answer: 1
  - question: "Wo greifst du sicher auf `window` oder `localStorage` zu?"
    options:
      - Im Konstruktor
      - In einem Feld-Initialisierer
      - "In `afterNextRender()` – es läuft nur im Browser"
      - In `ngOnInit`
    answer: 2
    explanation: "Konstruktor, Felder und `ngOnInit` laufen auch auf dem Server, wo es kein `window` gibt. `afterNextRender()` und `afterRenderEffect()` laufen nur im Browser, nach dem Rendern."
exercise:
  example: ex-after-render
  title: Ein Banner vermessen
  task: |-
    Die Komponente soll die Höhe des Banners anzeigen. Im Konstruktor gibt es das Banner aber noch nicht, deshalb steht dort immer 0.

    1. Miss die Höhe nach dem Rendern mit `this.banner().nativeElement.offsetHeight`, z. B. mit `afterNextRender()`.
    2. Miss erneut, wenn sich `large()` ändert. Dafür eignet sich `afterRenderEffect()`. Es kann auch Aufgabe 1 übernehmen.
  checks:
    measures-after-render: Nach dem Rendern zeigt die Seite die echte Höhe
    measures-again: Nach **Toggle size** stimmt die Höhe wieder
---

# SSR und Hydration

Eine normale Angular-App schickt dem Browser zuerst eine fast leere HTML-Seite. Erst wenn das JavaScript geladen ist, erscheint der Inhalt. Mit **Server-Side Rendering (SSR)** rendert Angular die Seite schon auf dem Server. Der Browser bekommt fertiges HTML und kann es sofort anzeigen.

## Drei Arten zu rendern

| Art | Wann wird gerendert? | Passt für |
|---|---|---|
| Client-Side Rendering | im Browser, nach dem Laden des JavaScripts | Apps hinter einem Login |
| Server-Side Rendering | auf dem Server, bei jeder Anfrage | Seiten mit aktuellen, individuellen Daten |
| Prerendering (SSG) | einmal beim Build | Inhalte, die für alle gleich sind |

Diese Lernplattform nutzt übrigens **Prerendering**: Jede Lektion ist beim Build schon als HTML-Datei entstanden.

Ein neues Projekt mit SSR legst du mit `ng new my-app --ssr` an, ein bestehendes rüstest du mit `ng add @angular/ssr` nach. Welche Route wie gerendert wird, legst du in `app.routes.server.ts` fest:

```ts
export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'account/**', renderMode: RenderMode.Client },
  { path: '**', renderMode: RenderMode.Server },
];
```

## Hydration

Das HTML vom Server ist zunächst nur Anzeige: Buttons reagieren noch nicht. Sobald das JavaScript geladen ist, **übernimmt** Angular das vorhandene HTML, statt es neu zu rendern. Es hängt Events und Zustand an die schon vorhandenen Elemente. Das nennt man **Hydration**. Eingeschaltet wird sie mit `provideClientHydration()`, bei SSR-Projekten ist das schon eingetragen.

Mit **inkrementeller Hydration** geht es noch einen Schritt weiter. Teile der Seite bleiben so lange reines HTML, bis sie gebraucht werden:

```html
@defer (hydrate on viewport) {
  <app-comments />
}
```

Seit Angular 22 ist inkrementelle Hydration mit `provideClientHydration()` automatisch eingeschaltet. In Angular 21 brauchst du dafür `provideClientHydration(withIncrementalHydration())`.

## Code, der nur im Browser laufen darf

Auf dem Server gibt es kein `window`, kein `document`, kein `localStorage` und keine Größen von Elementen. Konstruktoren, Felder und `ngOnInit` laufen aber auch dort. Code, der den Browser braucht, gehört deshalb in **`afterNextRender()`** oder **`afterRenderEffect()`**: Beide laufen nur im Browser, und zwar nach dem Rendern.

```ts
constructor() {
  // einmal nach dem ersten Rendern
  afterNextRender(() => {
    this.theme.set(localStorage.getItem('theme') ?? 'light');
  });

  // nach jedem Rendern, bei dem sich ein gelesenes Signal geändert hat
  afterRenderEffect(() => {
    this.wide();
    this.width.set(this.box().nativeElement.offsetWidth);
  });
}
```

Der zweite Grund für diese Funktionen gilt auch ohne SSR: Erst **nach** dem Rendern gibt es die Elemente der Komponente im DOM. Im Konstruktor kannst du sie weder finden noch vermessen.

::tryit{render-hooks}

> [!WARNING]
> Server und Browser müssen beim ersten Rendern **dasselbe** HTML erzeugen. Zeigst du etwa die aktuelle Uhrzeit oder eine Zufallszahl an, unterscheiden sich beide: Die Seite springt sichtbar um, sobald der Browser übernimmt. Hängt sogar die Struktur davon ab, etwa ein `@if` auf eine Zufallszahl, bricht die Hydration mit einem Fehler ab (*Hydration Mismatch*). Solche Werte setzt du erst in `afterNextRender()`.

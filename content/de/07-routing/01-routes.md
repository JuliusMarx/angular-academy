---
title: Routen und Navigation
minutes: 9
quiz:
  - question: Wo zeigt Angular die Komponente der aktuellen Route an?
    options: ["In app.ts", "Im `<router-outlet>`", "Im `<body>`", "In einem `@if`-Block"]
    answer: 1
  - question: "Warum muss `{ path: '**' }` als letzte Route stehen?"
    options:
      - Weil Angular sonst einen Fehler wirft
      - Weil der Router die erste passende Route nimmt – und ** passt auf alles
      - Weil ** nur am Ende erlaubt ist
      - Das ist egal, die Reihenfolge spielt keine Rolle
    answer: 1
  - question: Warum `routerLink` statt `href`?
    options:
      - href funktioniert in Angular gar nicht
      - routerLink wechselt die Seite ohne neu zu laden, der Zustand der App bleibt erhalten
      - routerLink ist nur kürzer
      - href ist veraltet
    answer: 1
exercise:
  example: ex-routes
  title: Eine Speisekarte mit Navigation
  task: |-
    Die App hat schon drei Seiten-Komponenten – aber noch keine Routen.

    1. Lege in `app.routes.ts` die Routen an: `''` → `Home`, `'menu'` → `Menu`, `'food'` leitet auf `'menu'` um, `'**'` → `NotFound`.
    2. Mach aus den Links in `app.ts` Router-Links. Der Link der aktuellen Seite bekommt die Klasse `active`. Zeige die aktuelle Seite mit `<router-outlet>` an.
    3. Importiere dafür, was das Template aus `@angular/router` braucht.
  checks:
    home-route: Die Startseite zeigt **Home**
    menu-link: Der Link **Menu** führt zu `/menu`
    active-link: Auf `/menu` hat nur der Menu-Link die Klasse `active`
    redirect: "`/food` leitet auf `/menu` um"
    not-found: Unbekannte URLs zeigen **Page not found**
---

# Routen und Navigation

Bisher bestand jede App aus einer einzigen Seite. Echte Anwendungen haben viele: Startseite, Produktliste, Detailansicht, Warenkorb. Der **Angular Router** ordnet jeder URL eine Komponente zu – ohne dass der Browser die Seite neu lädt.

## Routen definieren

Eine Route verbindet einen Pfad mit einer Komponente:

```ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', component: Home, title: 'Start' },
  { path: 'about', component: About, title: 'Über uns' },
  { path: 'team', redirectTo: 'about' },
  { path: '**', component: NotFound },
];
```

- `path` steht **ohne** führenden Schrägstrich. `''` ist die Startseite.
- `title` setzt den Titel des Browser-Tabs.
- `redirectTo` leitet eine URL auf eine andere um – praktisch für alte Links.
- `**` passt auf **jede** URL. Der Router nimmt die **erste** passende Route, deshalb gehört `**` ans Ende.

Die Routen meldest du in `app.config.ts` an:

```ts
import { provideRouter } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)],
};
```

## Wo die Seite erscheint: router-outlet

`<router-outlet />` ist der Platzhalter, an dem der Router die Komponente der aktuellen Route anzeigt. Alles außerhalb – etwa die Navigation – bleibt beim Seitenwechsel stehen:

```ts
@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <nav>
      <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Start</a>
      <a routerLink="/about" routerLinkActive="active">Über uns</a>
    </nav>
    <router-outlet />
  `,
})
export class App {}
```

## Links: routerLink und routerLinkActive

- **`routerLink`** statt `href`: Der Router wechselt die Seite, ohne neu zu laden. Der Zustand der App – etwa ein gefüllter Warenkorb – bleibt erhalten.
- **`routerLinkActive="active"`** setzt die Klasse `active`, solange der Link zur aktuellen URL passt.
- `{ exact: true }` braucht der Link zur Startseite: Ohne diese Option wäre `/` bei *jeder* URL aktiv, weil jede URL mit `/` beginnt.

::tryit{routing-basics}

> [!NOTE]
> Findet der Router für eine URL keine Route und gibt es kein `**`, bricht die Navigation mit dem Fehler `NG04002: Cannot match any routes` ab.

> [!TIP]
> Lege die Routen in einer eigenen Datei `app.routes.ts` ab, so wie es die Angular CLI auch tut. Dann bleibt `app.config.ts` übersichtlich.

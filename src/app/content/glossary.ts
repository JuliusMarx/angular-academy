import { Lang } from './content.model';

export interface GlossaryEntry {
  /** Anchor on the glossary page. */
  id: string;
  /** The term – one string if it is the same in both languages. */
  term: string | Record<Lang, string>;
  /** Short explanation per language. Text in `backticks` is shown as code. */
  text: Record<Lang, string>;
  /** Lesson ids ("chapter/lesson") that explain the term in depth. */
  lessons: string[];
}

/** Key terms of the course. Keep it sorted loosely by topic – the page sorts alphabetically. */
export const GLOSSARY: GlossaryEntry[] = [
  {
    id: 'component',
    term: { de: 'Komponente', en: 'Component' },
    text: {
      de: 'Baustein einer Angular-Oberfläche: eine Klasse mit `@Component`, die ein Template, Styles und Logik zusammenfasst.',
      en: 'Building block of an Angular UI: a class with `@Component` that bundles a template, styles and logic.',
    },
    lessons: ['introduction/first-component'],
  },
  {
    id: 'standalone',
    term: 'Standalone',
    text: {
      de: 'Komponenten, Direktiven und Pipes, die ihre Abhängigkeiten selbst in `imports` angeben – ohne NgModule. Seit v19 der Standard.',
      en: 'Components, directives and pipes that list their own dependencies in `imports` – no NgModule needed. The default since v19.',
    },
    lessons: ['introduction/first-component'],
  },
  {
    id: 'cli',
    term: 'Angular CLI',
    text: {
      de: 'Kommandozeilenwerkzeug `ng` zum Anlegen, Starten, Testen und Bauen von Angular-Projekten.',
      en: 'The `ng` command-line tool to create, serve, test and build Angular projects.',
    },
    lessons: ['introduction/angular-cli'],
  },
  {
    id: 'interpolation',
    term: 'Interpolation',
    text: {
      de: 'Ausgabe eines Werts im Template mit `{{ ausdruck }}`.',
      en: 'Showing a value in the template with `{{ expression }}`.',
    },
    lessons: ['templates/interpolation-and-bindings'],
  },
  {
    id: 'binding',
    term: { de: 'Binding (Property- und Event-Binding)', en: 'Binding (property and event binding)' },
    text: {
      de: '`[prop]="wert"` setzt eine Eigenschaft eines Elements, `(event)="handler()"` reagiert auf ein Ereignis.',
      en: '`[prop]="value"` sets a property of an element, `(event)="handler()"` reacts to an event.',
    },
    lessons: ['templates/interpolation-and-bindings'],
  },
  {
    id: 'control-flow',
    term: 'Control Flow',
    text: {
      de: 'Eingebaute Template-Blöcke `@if`, `@for` und `@switch` für Bedingungen und Listen.',
      en: 'Built-in template blocks `@if`, `@for` and `@switch` for conditions and lists.',
    },
    lessons: ['templates/control-flow'],
  },
  {
    id: 'track',
    term: 'track',
    text: {
      de: 'Pflichtangabe bei `@for`: sagt Angular, woran es Listeneinträge wiedererkennt, damit nur Geändertes neu gerendert wird.',
      en: 'Required in `@for`: tells Angular how to recognize list items, so only changed ones are re-rendered.',
    },
    lessons: ['templates/control-flow', 'advanced/performance'],
  },
  {
    id: 'defer',
    term: '@defer',
    text: {
      de: 'Template-Block, der seinen Inhalt samt Code erst später lädt – etwa wenn er sichtbar wird.',
      en: 'Template block that loads its content and code later – for example when it scrolls into view.',
    },
    lessons: ['templates/defer'],
  },
  {
    id: 'signal',
    term: 'Signal',
    text: {
      de: 'Reaktiver Wert: `signal()` hält ihn, Lesen mit `wert()` meldet eine Abhängigkeit an, `set()`/`update()` benachrichtigen alle Leser.',
      en: 'Reactive value: `signal()` holds it, reading with `value()` registers a dependency, `set()`/`update()` notify all readers.',
    },
    lessons: ['signals/signals-and-computed'],
  },
  {
    id: 'computed',
    term: 'computed()',
    text: {
      de: 'Abgeleitetes, schreibgeschütztes Signal, das sich automatisch neu berechnet, wenn sich seine Quellen ändern.',
      en: 'Derived read-only signal that recalculates automatically when its sources change.',
    },
    lessons: ['signals/signals-and-computed'],
  },
  {
    id: 'effect',
    term: 'effect()',
    text: {
      de: 'Führt Code aus, sobald sich gelesene Signals ändern – für Nebeneffekte wie Speichern oder Logging, nicht für abgeleitete Werte.',
      en: 'Runs code whenever the signals it reads change – for side effects such as saving or logging, not for derived values.',
    },
    lessons: ['signals/effect'],
  },
  {
    id: 'linked-signal',
    term: 'linkedSignal()',
    text: {
      de: 'Beschreibbares Signal, das sich auf einen abgeleiteten Wert zurücksetzt, sobald sich seine Quelle ändert.',
      en: 'Writable signal that resets to a derived value whenever its source changes.',
    },
    lessons: ['signals/linked-signal'],
  },
  {
    id: 'resource',
    term: 'resource()',
    text: {
      de: 'Lädt asynchrone Daten abhängig von Signals und stellt Wert, Ladezustand und Fehler als Signals bereit.',
      en: 'Loads async data based on signals and exposes value, loading state and error as signals.',
    },
    lessons: ['signals/resource'],
  },
  {
    id: 'input',
    term: 'input()',
    text: {
      de: 'Eingabe einer Komponente als Signal; die Elternkomponente setzt sie mit `[name]="wert"`.',
      en: 'A component input as a signal; the parent sets it with `[name]="value"`.',
    },
    lessons: ['component-communication/inputs'],
  },
  {
    id: 'output',
    term: 'output()',
    text: {
      de: 'Ereignis einer Komponente, das die Elternkomponente mit `(name)="handler($event)"` abonniert.',
      en: 'A component event the parent listens to with `(name)="handler($event)"`.',
    },
    lessons: ['component-communication/outputs'],
  },
  {
    id: 'model',
    term: 'model()',
    text: {
      de: 'Eingabe, die die Komponente auch selbst ändern kann – für Zwei-Wege-Bindung mit `[(name)]`.',
      en: 'An input the component can also change itself – for two-way binding with `[(name)]`.',
    },
    lessons: ['component-communication/model'],
  },
  {
    id: 'content-projection',
    term: { de: 'Content Projection', en: 'Content projection' },
    text: {
      de: 'Inhalte zwischen den Tags einer Komponente an einer Stelle ihres Templates anzeigen – mit `<ng-content>`.',
      en: 'Showing the content between a component’s tags somewhere in its template – with `<ng-content>`.',
    },
    lessons: ['component-communication/content-projection'],
  },
  {
    id: 'directive',
    term: { de: 'Direktive', en: 'Directive' },
    text: {
      de: 'Klasse mit `@Directive`, die einem vorhandenen Element Verhalten oder Aussehen hinzufügt.',
      en: 'Class with `@Directive` that adds behavior or styling to an existing element.',
    },
    lessons: ['directives-and-pipes/attribute-directives'],
  },
  {
    id: 'pipe',
    term: 'Pipe',
    text: {
      de: 'Formatiert einen Wert im Template, z. B. `{{ preis | currency }}`. Eigene Pipes sind Klassen mit `@Pipe`.',
      en: 'Formats a value in the template, e.g. `{{ price | currency }}`. Custom pipes are classes with `@Pipe`.',
    },
    lessons: ['directives-and-pipes/builtin-pipes', 'directives-and-pipes/custom-pipes'],
  },
  {
    id: 'service',
    term: 'Service',
    text: {
      de: 'Klasse für Logik und Zustand, die mehrere Komponenten teilen; sie wird per Dependency Injection bereitgestellt.',
      en: 'Class for logic and state that several components share; it is provided through dependency injection.',
    },
    lessons: ['services-and-di/services'],
  },
  {
    id: 'di',
    term: 'Dependency Injection (DI)',
    text: {
      de: 'Angular erzeugt Abhängigkeiten und reicht sie herein: `inject(MeinService)` statt `new MeinService()`.',
      en: 'Angular creates dependencies and hands them in: `inject(MyService)` instead of `new MyService()`.',
    },
    lessons: ['services-and-di/services', 'services-and-di/injector-hierarchy'],
  },
  {
    id: 'provider',
    term: 'Provider',
    text: {
      de: 'Anweisung, wie ein Wert für ein Token erzeugt wird, z. B. `useClass`, `useValue` oder `useFactory`.',
      en: 'Instruction for how to create the value of a token, e.g. `useClass`, `useValue` or `useFactory`.',
    },
    lessons: ['services-and-di/providers'],
  },
  {
    id: 'injection-token',
    term: 'InjectionToken',
    text: {
      de: 'Schlüssel für Werte ohne eigene Klasse, etwa Konfigurationen, die per DI bereitgestellt werden.',
      en: 'Key for values without their own class, such as configuration provided through DI.',
    },
    lessons: ['services-and-di/providers'],
  },
  {
    id: 'route',
    term: { de: 'Route', en: 'Route' },
    text: {
      de: 'Zuordnung eines URL-Pfads zu einer Komponente; `<router-outlet>` zeigt die aktive an.',
      en: 'Maps a URL path to a component; `<router-outlet>` shows the active one.',
    },
    lessons: ['routing/routes', 'routing/route-params'],
  },
  {
    id: 'lazy-loading',
    term: 'Lazy Loading',
    text: {
      de: 'Code eines Bereichs erst laden, wenn er gebraucht wird – bei Routen mit `loadComponent` oder `loadChildren`.',
      en: 'Loading a part of the app only when it is needed – for routes with `loadComponent` or `loadChildren`.',
    },
    lessons: ['routing/lazy-loading'],
  },
  {
    id: 'guard',
    term: 'Guard',
    text: {
      de: 'Funktion, die entscheidet, ob eine Route betreten oder verlassen werden darf, z. B. `canActivate`.',
      en: 'Function that decides whether a route may be entered or left, e.g. `canActivate`.',
    },
    lessons: ['routing/guards'],
  },
  {
    id: 'signal-forms',
    term: 'Signal Forms',
    text: {
      de: 'Formular-API auf Basis von Signals: `form()` erzeugt aus einem Modell-Signal typsichere Felder mit Validierung.',
      en: 'Signal-based forms API: `form()` turns a model signal into type-safe fields with validation.',
    },
    lessons: ['forms/signal-forms', 'forms/validation'],
  },
  {
    id: 'reactive-forms',
    term: 'Reactive Forms',
    text: {
      de: 'Ältere Formular-API mit `FormGroup` und `FormControl`, deren Änderungen als Observables kommen.',
      en: 'Older forms API with `FormGroup` and `FormControl` whose changes arrive as observables.',
    },
    lessons: ['forms/reactive-forms'],
  },
  {
    id: 'http-client',
    term: 'HttpClient',
    text: {
      de: 'Service für HTTP-Anfragen; liefert die Antwort als Observable.',
      en: 'Service for HTTP requests; returns the response as an observable.',
    },
    lessons: ['http/http-client', 'testing/http-tests'],
  },
  {
    id: 'http-resource',
    term: 'httpResource()',
    text: {
      de: 'Lädt Daten per HTTP abhängig von Signals und liefert sie als Resource mit Ladezustand.',
      en: 'Loads data over HTTP based on signals and returns it as a resource with loading state.',
    },
    lessons: ['http/http-resource'],
  },
  {
    id: 'interceptor',
    term: 'Interceptor',
    text: {
      de: 'Funktion, die jede HTTP-Anfrage und -Antwort sieht – für Header, Logging oder Fehlerbehandlung.',
      en: 'Function that sees every HTTP request and response – for headers, logging or error handling.',
    },
    lessons: ['http/interceptors'],
  },
  {
    id: 'observable',
    term: 'Observable',
    text: {
      de: 'Strom von Werten über die Zeit aus RxJS; erst `subscribe()` startet ihn.',
      en: 'A stream of values over time from RxJS; it only starts on `subscribe()`.',
    },
    lessons: ['rxjs/observables', 'rxjs/operators'],
  },
  {
    id: 'to-signal',
    term: 'toSignal() / toObservable()',
    text: {
      de: 'Brücken zwischen RxJS und Signals: ein Observable als Signal lesen oder ein Signal als Observable weitergeben.',
      en: 'Bridges between RxJS and signals: read an observable as a signal or pass a signal on as an observable.',
    },
    lessons: ['rxjs/interop'],
  },
  {
    id: 'testbed',
    term: 'TestBed',
    text: {
      de: 'Testumgebung von Angular, die Komponenten und Services mit DI für Unit-Tests aufbaut.',
      en: 'Angular’s testing environment that sets up components and services with DI for unit tests.',
    },
    lessons: ['testing/unit-tests', 'testing/component-tests'],
  },
  {
    id: 'e2e',
    term: { de: 'UI-Test (End-to-End)', en: 'UI test (end-to-end)' },
    text: {
      de: 'Test, der die fertige App im Browser bedient wie ein Mensch – im Kurs mit Playwright.',
      en: 'Test that drives the finished app in a browser like a person would – with Playwright in this course.',
    },
    lessons: ['testing/ui-tests'],
  },
  {
    id: 'change-detection',
    term: 'Change Detection',
    text: {
      de: 'Wie Angular erkennt, welche Teile der Oberfläche neu gerendert werden müssen.',
      en: 'How Angular finds out which parts of the UI need to be re-rendered.',
    },
    lessons: ['advanced/change-detection'],
  },
  {
    id: 'zoneless',
    term: 'Zoneless',
    text: {
      de: 'Change Detection ohne zone.js: Angular rendert neu, wenn Signals oder Ereignisse es anstoßen. Standard seit v21.',
      en: 'Change detection without zone.js: Angular re-renders when signals or events trigger it. The default since v21.',
    },
    lessons: ['advanced/change-detection'],
  },
  {
    id: 'ssr',
    term: 'SSR / Prerendering',
    text: {
      de: 'HTML schon auf dem Server (SSR) oder beim Build (Prerendering) erzeugen, damit die Seite schneller sichtbar ist.',
      en: 'Generating HTML on the server (SSR) or at build time (prerendering), so the page shows up faster.',
    },
    lessons: ['advanced/ssr-hydration'],
  },
  {
    id: 'hydration',
    term: 'Hydration',
    text: {
      de: 'Der Browser übernimmt das fertige Server-HTML und macht es interaktiv, statt alles neu zu rendern.',
      en: 'The browser takes over the server-rendered HTML and makes it interactive instead of rendering it again.',
    },
    lessons: ['advanced/ssr-hydration'],
  },
  {
    id: 'aria',
    term: 'ARIA',
    text: {
      de: 'Attribute wie `aria-label` oder `aria-expanded`, die Hilfstechnologien Rolle und Zustand eines Elements mitteilen.',
      en: 'Attributes such as `aria-label` or `aria-expanded` that tell assistive technology an element’s role and state.',
    },
    lessons: ['accessibility/aria'],
  },
  {
    id: 'live-region',
    term: { de: 'Live-Region', en: 'Live region' },
    text: {
      de: 'Bereich mit `aria-live` oder `role="status"`, dessen Änderungen Screenreader von selbst vorlesen.',
      en: 'Area with `aria-live` or `role="status"` whose changes screen readers announce on their own.',
    },
    lessons: ['accessibility/announcements-and-testing'],
  },
];

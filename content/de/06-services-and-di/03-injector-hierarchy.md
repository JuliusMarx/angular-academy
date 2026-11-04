---
title: Die Injector-Hierarchie
minutes: 8
summary: |-
  - Es gibt den Root-Injector (`providedIn: 'root'` und `app.config.ts`) und zusätzlich einen Injector für jede Komponente mit eigenen `providers`.
  - Angular sucht von unten nach oben – Komponente, Eltern, Root. Der erste Treffer gewinnt.
  - Mit `providers: [CounterService]` im `@Component` bekommt jede Instanz der Komponente ihren eigenen Service.
  - Kind-Komponenten bekommen die Instanz vom nächsten Provider über ihnen.
  - Eine Service-Instanz aus den `providers` einer Komponente lebt so lange wie die Komponente und wird mit ihr zerstört.
  - Faustregel: `providedIn: 'root'` für app-weiten Zustand, Komponenten-`providers` für Zustand eines Bereichs.

  ```ts
  @Component({
    selector: 'app-own-counter',
    providers: [CounterService],
    template: `{{ counter.count() }} <ng-content />`,
  })
  export class OwnCounter {
    protected readonly counter = inject(CounterService);
  }
  ```
quiz:
  - question: "Was passiert mit `providers: [ScoreService]` im @Component-Decorator?"
    options:
      - Die App bekommt eine zweite globale Instanz
      - Jede Instanz dieser Komponente bekommt ihre eigene ScoreService-Instanz
      - Der Service wird für diese Komponente gesperrt
      - Nichts – providedIn root hat Vorrang
    answer: 1
  - question: Welche Instanz bekommt eine Kind-Komponente, die ScoreService injiziert?
    options:
      - Immer die aus dem Root-Injector
      - Die vom nächsten Provider über ihr im Komponentenbaum
      - Immer eine neue
      - Gar keine
    answer: 1
  - question: Was passiert mit einer Service-Instanz aus providers einer Komponente, wenn die Komponente zerstört wird?
    options:
      - Sie bleibt für immer bestehen
      - Sie wird mit der Komponente zerstört
      - Sie wandert in den Root-Injector
      - Sie wird an die nächste Komponente weitergegeben
    answer: 1
exercise:
  example: ex-hierarchy
  title: Getrennte Spielstände
  task: |-
    Zwei Anzeigetafeln teilen sich gerade einen `ScoreService` – ein Punkt für Team A erscheint auch bei Team B.

    Sorge in `score-board.ts` dafür, dass jede Tafel ihren **eigenen** `ScoreService` bekommt. Die Buttons in `ScoreButtons` sollen dabei weiterhin die Instanz ihrer Tafel verwenden.
  checks:
    independent: "**+1** bei Team A ändert Team B nicht"
    children-share-board: Die Buttons von Team B zählen für Team B
    separate-reset: "**Reset** bei Team A setzt nur Team A zurück"
---

# Die Injector-Hierarchie

Mit `providedIn: 'root'` gibt es genau eine Instanz für die ganze App. Manchmal soll aber jede Komponente ihre **eigene** Instanz haben: jedes Formular seinen eigenen Entwurf, jede Spieltafel ihren eigenen Punktestand. Dafür ist wichtig zu wissen, wie Angular nach einem Service sucht.

## Injectors bilden einen Baum

Angular hat nicht einen, sondern viele **Injectors**:

- den **Root-Injector** für die ganze App (dort landet alles mit `providedIn: 'root'` und alles aus `app.config.ts`),
- und zusätzlich einen Injector für **jede Komponente**, die eigene `providers` hat.

Fragt eine Komponente nach einem Service, sucht Angular von unten nach oben: erst bei der Komponente selbst, dann bei ihren Eltern, dann beim Root-Injector. Der **erste Treffer** gewinnt.

## Eigene Instanz pro Komponente

```ts
@Component({
  selector: 'app-own-counter',
  providers: [CounterService],
  template: `{{ counter.count() }} <ng-content />`,
})
export class OwnCounter {
  protected readonly counter = inject(CounterService);
}
```

Mit `providers: [CounterService]` bekommt **jede** `<app-own-counter>`-Instanz ihren eigenen `CounterService`. Zwei Zähler auf der Seite zählen dann unabhängig voneinander.

Ohne `providers` landen beide beim Root-Injector – und teilen sich einen Zähler.

## Kinder erben vom nächsten Provider

Kind-Komponenten, die denselben Service injizieren, bekommen die Instanz des **nächsten Providers über ihnen**:

```html
<app-own-counter>          <!-- providers: [CounterService] → Instanz A -->
  <app-counter-display />  <!-- inject(CounterService) → auch Instanz A -->
</app-own-counter>
```

So kann eine Komponente einen Service für sich und alle ihre Kinder bereitstellen – ohne dass er global wird.

::tryit{di-hierarchy}

## Lebensdauer

Eine Instanz aus den `providers` einer Komponente lebt so lange wie die Komponente. Wird die Komponente zerstört, etwa durch ein `@if`, wird auch ihr Service zerstört – und beim nächsten Anzeigen neu erzeugt.

> [!TIP]
> Faustregel: `providedIn: 'root'` für Zustand, den die ganze App teilt (angemeldeter Nutzer, Warenkorb). Komponenten-`providers` für Zustand, der zu genau einem Bereich der Oberfläche gehört.

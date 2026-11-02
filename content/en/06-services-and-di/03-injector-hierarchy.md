---
title: The injector hierarchy
minutes: 8
quiz:
  - question: "What does `providers: [ScoreService]` in the @Component decorator do?"
    options:
      - The app gets a second global instance
      - Every instance of this component gets its own ScoreService instance
      - The service is blocked for this component
      - Nothing – providedIn root takes precedence
    answer: 1
  - question: Which instance does a child component get when it injects ScoreService?
    options:
      - Always the one from the root injector
      - The one from the nearest provider above it in the component tree
      - Always a new one
      - None at all
    answer: 1
  - question: What happens to a service instance from a component's providers when the component is destroyed?
    options:
      - It lives on forever
      - It is destroyed together with the component
      - It moves to the root injector
      - It is passed on to the next component
    answer: 1
exercise:
  example: ex-hierarchy
  title: Separate scores
  task: |-
    Two scoreboards currently share one `ScoreService` – a point for Team A also shows up for Team B.

    In `score-board.ts`, make sure every board gets its **own** `ScoreService`. The buttons in `ScoreButtons` should still use their board's instance.
  checks:
    independent: "**+1** for Team A doesn't change Team B"
    children-share-board: "Team B's buttons count for Team B"
    separate-reset: "**Reset** for Team A only resets Team A"
---

# The injector hierarchy

With `providedIn: 'root'` there is exactly one instance for the whole app. Sometimes, though, every component should have its **own** instance: every form its own draft, every scoreboard its own score. For that, it helps to know how Angular looks for a service.

## Injectors form a tree

Angular has not one but many **injectors**:

- the **root injector** for the whole app (everything with `providedIn: 'root'` and everything from `app.config.ts` ends up there),
- plus an injector for **every component** that has its own `providers`.

When a component asks for a service, Angular searches from the bottom up: first at the component itself, then at its parents, then at the root injector. The **first match** wins.

## Own instance per component

```ts
@Component({
  selector: 'app-own-counter',
  providers: [CounterService],
  template: `{{ counter.count() }}`,
})
export class OwnCounter {
  protected readonly counter = inject(CounterService);
}
```

With `providers: [CounterService]`, **every** `<app-own-counter>` instance gets its own `CounterService`. Two counters on the page then count independently.

Without `providers`, both end up at the root injector – and share one counter.

## Children inherit from the nearest provider

Child components that inject the same service get the instance of the **nearest provider above them**:

```html
<app-own-counter>          <!-- providers: [CounterService] → instance A -->
  <app-counter-display />  <!-- inject(CounterService) → also instance A -->
</app-own-counter>
```

That way a component can provide a service for itself and all its children – without making it global.

::tryit{di-hierarchy}

## Lifetime

An instance from a component's `providers` lives as long as the component. When the component is destroyed, for example by an `@if`, its service is destroyed too – and created anew the next time it is shown.

> [!TIP]
> Rule of thumb: `providedIn: 'root'` for state the whole app shares (signed-in user, cart). Component `providers` for state that belongs to exactly one area of the UI.

---
title: Change detection and zoneless
minutes: 8
quiz:
  - question: "A plain field is changed in a `setTimeout`. What happens in a zoneless app?"
    options:
      - The page updates right away
      - The change only shows up once something else triggers an update
      - Angular throws an error
      - The timer doesn't run
    answer: 1
  - question: What triggers an update in a zoneless app?
    options:
      - Every timer and every promise
      - Changed signals read by the template, and events with an Angular handler
      - Only reloading the page
      - Only `ngOnInit`
    answer: 1
  - question: "What does `ChangeDetectionStrategy.OnPush` mean?"
    options:
      - The component is never updated
      - The component is only checked when its inputs, signals it reads or its own events change
      - The component is checked on every timer
      - The component only renders on the server
    answer: 1
exercise:
  example: ex-zoneless
  title: A countdown that moves
  task: |-
    The countdown counts down in the background and the weather is being "loaded". But nothing happens on the page.

    Turn `countdown` and `weather` into signals. Change them with `set()` or `update()` and read them in the template with `()`.
  checks:
    countdown-updates: The countdown visibly counts down, without a click
    liftoff: At 0, “Liftoff!” appears
    weather-updates: After loading, the weather shows “Clear skies”
---

# Change detection and zoneless

**Change detection** is the mechanism Angular uses to bring the DOM in line with your data. The key question is: how does Angular know *when* something has changed?

## Then: Zone.js

For a long time, the **Zone.js** library watched every asynchronous browser function: timers, promises, events, HTTP. After each of them, Angular checked the whole app just in case something had changed. That was convenient but expensive: many of those checks were for nothing, and Zone.js itself made the app bigger and harder to debug.

## Now: zoneless

New Angular apps run **without Zone.js**. Angular only updates the page when there is a concrete reason:

- a **signal** read by a template has changed,
- an **event** with an Angular handler fired, e.g. `(click)`,
- an input changed, or you called `markForCheck()`.

That has an important consequence: if you change a **plain field** in a timer or callback, Angular doesn't notice.

```ts
protected plainCount = 0;
protected readonly signalCount = signal(0);

setTimeout(() => this.plainCount++, 1000);                     // page stays stale
setTimeout(() => this.signalCount.update((n) => n + 1), 1000); // page updates
```

::tryit{cd-zoneless}

Try it: after the timer, only the signal shows the new value. The field only appears once you click the button with the empty handler. By the way, clicking an element **without** an Angular handler triggers nothing.

> [!TIP]
> The rule of thumb is simple: **anything that changes and is displayed belongs in a signal.** Then you don't have to think about change detection at all.

## OnPush

Components can declare `ChangeDetectionStrategy.OnPush` so that Angular only checks them when

- one of their inputs changes,
- a signal read by their template changes, or
- an event fires inside them.

All other updates of the app skip the component and its children. With signals there is no downside to this, which is why **OnPush is the default since Angular 22**. In Angular 21, where the live examples run, Angular still checks every component on every update. For code with signals, that makes no difference.

> [!NOTE]
> Existing apps with Zone.js keep working. When moving to zoneless, look for places that change plain fields in timers, promises or callbacks and turn them into signals. Angular takes care of the rest.

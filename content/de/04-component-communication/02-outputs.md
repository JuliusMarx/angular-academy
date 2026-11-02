---
title: Ereignisse melden mit output()
minutes: 7
quiz:
  - question: Wie löst die Kind-Komponente ein Output namens rated aus?
    options: ["this.rated.set(5)", "this.rated(5)", "this.rated.emit(5)", "this.rated.next(5)"]
    answer: 2
  - question: Wie heißt im Template der Wert, den ein Output ausgelöst hat?
    options: ["$value", "$event", "$output", "event.detail"]
    answer: 1
    explanation: "`$event` ist bei eigenen Outputs der Wert aus `emit()` – bei DOM-Ereignissen wie `(click)` das DOM-Event."
  - question: Wie bindest du in der Eltern-Komponente auf das Output rated?
    options: ['[rated]="onRated()"', '(rated)="onRated($event)"', '{{ rated }}', '[(rated)]="rating"']
    answer: 1
exercise:
  example: ex-outputs
  title: Likes nach oben melden
  task: |-
    Der Like-Button zählt seine Klicks, aber der Beitrag erfährt nichts davon.

    1. Gib `LikeButton` ein Output `liked`, das die neue Anzahl Likes schickt.
    2. Löse es in `like()` aus.
    3. Höre in `app.ts` darauf und speichere den Wert in `likes`.
  checks:
    parent-updates: Nach einem Klick zeigt der Beitrag **1 likes**
    sends-count: Nach drei Klicks zeigt er **3 likes**
---

# Ereignisse melden mit output()

Inputs bringen Daten von oben nach unten. Für den Rückweg – „der Nutzer hat 4 Sterne vergeben“ – gibt es **Outputs**. Eine Kind-Komponente meldet damit ein Ereignis, die Eltern-Komponente reagiert darauf.

## Ein Output deklarieren und auslösen

```ts
import { Component, output } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  template: `
    @for (star of [1, 2, 3, 4, 5]; track star) {
      <button (click)="rated.emit(star)">★</button>
    }
  `,
})
export class StarRating {
  readonly rated = output<number>();
}
```

- `output<number>()` legt fest, welcher Typ beim Auslösen mitgeschickt wird.
- `emit(wert)` löst das Ereignis aus.

## Auf ein Output reagieren

Die Eltern-Komponente bindet das Output mit runden Klammern – genau wie bei `(click)`:

```html
<app-star-rating (rated)="onRated($event)" />
```

```ts
protected onRated(stars: number): void {
  this.rating.set(stars);
}
```

`$event` ist hier der Wert, der mit `emit()` geschickt wurde – also die Anzahl Sterne.

## Ereignisse ohne Wert

Manchmal reicht die Information, *dass* etwas passiert ist:

```ts
readonly cleared = output<void>();

clear(): void {
  this.cleared.emit();
}
```

```html
<app-star-rating (cleared)="rating.set(null)" />
```

::tryit{component-outputs}

> [!TIP]
> Benenne Outputs nach dem, **was passiert ist** – `rated`, `closed`, `selected` –, nicht nach dem, was die Eltern-Komponente damit tun soll. So bleibt die Kind-Komponente wiederverwendbar.

> [!WARNING]
> Gib einem Output keinen Namen, den es auch als DOM-Ereignis gibt, etwa `click` oder `change`. Sonst reagiert der Handler auch auf das native Ereignis, das aus der Komponente heraus „hochblubbert“.

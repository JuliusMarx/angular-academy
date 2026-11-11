---
title: Signals und RxJS verbinden
minutes: 8
summary: |-
  - Das Paket `@angular/core/rxjs-interop` verbindet Signals und Observables.
  - `toSignal(obs$)` macht aus einem Observable ein Signal und meldet sich selbst ab. Ohne `initialValue` ist es erst `undefined`.
  - `toSignal()` braucht einen Injection Context: Ruf es beim Initialisieren eines Felds auf, nicht in einer Methode.
  - `toObservable(signal)` macht aus einem Signal ein Observable, so nutzt du Zeit-Operatoren auf Signals. Es gibt Werte asynchron weiter.
  - `rxResource()` ist wie `resource()`, nur dass `stream` ein Observable zurückgibt.
  - Musst du selbst abonnieren, meldet `takeUntilDestroyed()` dich automatisch ab (außerhalb eines Injection Context mit `this.destroyRef`).

  ```ts
  protected readonly query = signal('');

  protected readonly results = toSignal(
    toObservable(this.query).pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((q) => this.countries.search(q)),
    ),
    { initialValue: [] },
  );
  ```
quiz:
  - question: "Warum musst du bei `toSignal()` nicht selbst abmelden?"
    options:
      - Weil Signals keine Subscriptions haben
      - Weil `toSignal()` sich automatisch abmeldet, wenn die Komponente zerstört wird
      - Weil das Observable nur einen Wert liefert
      - Man muss doch abmelden
    answer: 1
  - question: Wie machst du aus einem Signal ein Observable?
    options: ["toSignal()", "toObservable()", "signal.pipe()", "of(signal)"]
    answer: 1
  - question: "Wo darf `toSignal()` aufgerufen werden?"
    options:
      - Überall
      - In einem Injection Context, z. B. beim Initialisieren eines Felds
      - Nur in `ngOnInit`
      - Nur in Services
    answer: 1
    explanation: "`toSignal()` braucht den `DestroyRef` der Umgebung, um sich abzumelden. Außerhalb eines Injection Context übergibst du mit der Option `injector` einen Injector."
exercise:
  example: ex-interop
  title: Live-Benachrichtigungen
  task: |-
    Der Service `Notifications` liefert neue Nachrichten als Observable `messages$`. Bring sie in die Komponente:

    1. `latest`: die letzte Nachricht, mit `toSignal()` (Startwert `'No messages yet'`).
    2. `history`: alle Nachrichten als Liste, mit `scan()` gesammelt und mit `toSignal()` umgewandelt (Startwert `[]`).
    3. Der Filter soll erst nach 300 ms Tipp-Pause greifen: Mach mit `toObservable()` ein Observable aus `keyword`, entprelle es mit `debounceTime(300)` und wandle es mit `toSignal()` zurück. Filtere `history` damit, ohne auf Groß- und Kleinschreibung zu achten.
  checks:
    latest-message: Die letzte Nachricht erscheint unter „Latest“
    message-history: Alle drei Nachrichten werden gesammelt
    debounced-filter: Der Filter greift erst nach einer Tipp-Pause
---

# Signals und RxJS verbinden

In Angular arbeiten Signals und Observables Hand in Hand. Templates, `computed()` und Inputs sprechen Signals. HTTP, Events und zeitliche Abläufe kommen oft als Observable. Das Paket `@angular/core/rxjs-interop` verbindet beide Welten.

## Observable → Signal: toSignal

`toSignal()` abonniert ein Observable und gibt dir ein Signal mit dem jeweils neuesten Wert:

```ts
import { toSignal } from '@angular/core/rxjs-interop';

protected readonly now = toSignal(interval(1000).pipe(map(() => Date.now())), {
  initialValue: Date.now(),
});
```

- **Abmelden musst du nicht**: `toSignal()` meldet sich ab, wenn die Komponente (oder der Service) zerstört wird.
- Ohne `initialValue` ist das Signal `undefined`, bis der erste Wert kommt. Liefert das Observable seinen ersten Wert garantiert sofort, sagst du das mit `{ requireSync: true }`.
- `toSignal()` braucht einen **Injection Context**. Ruf es also beim Initialisieren eines Felds auf, nicht in einer Methode.

## Signal → Observable: toObservable

Den umgekehrten Weg geht `toObservable()`: Jedes Mal, wenn sich das Signal ändert, kommt ein neuer Wert. Damit kannst du die Zeit-Operatoren von RxJS auf Signals anwenden:

```ts
protected readonly query = signal('');

protected readonly results = toSignal(
  toObservable(this.query).pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap((q) => this.countries.search(q)),
  ),
  { initialValue: [] },
);
```

Signal rein, RxJS-Pipeline in der Mitte, Signal raus. Das ist ein sehr häufiges Muster.

::tryit{rxjs-interop}

> [!NOTE]
> `toObservable()` gibt den Wert **asynchron** weiter, nachdem Angular die Änderung verarbeitet hat. Setzt du ein Signal zweimal direkt hintereinander, kommt nur der letzte Wert im Observable an.

## rxResource

Wenn dich nur das Ergebnis interessiert, ist `rxResource()` noch kürzer. Es ist wie `resource()` aus dem Signals-Kapitel, nur dass die Ladefunktion (`stream`) ein Observable zurückgibt:

```ts
protected readonly letter = signal('A');

protected readonly byLetter = rxResource({
  params: () => this.letter(),
  stream: ({ params }) => this.countries.startingWith(params),
});
```

Du bekommst dieselben Signals wie bei `resource()`: `value()`, `isLoading()`, `error()` und `reload()`.

## takeUntilDestroyed

Musst du doch einmal selbst abonnieren, etwa um bei jedem Wert eine Aktion auszulösen, meldet `takeUntilDestroyed()` dich automatisch ab:

```ts
constructor() {
  this.notifications.messages$
    .pipe(takeUntilDestroyed())
    .subscribe((message) => this.toast.show(message));
}
```

Ohne Argument funktioniert es nur in einem Injection Context, hier also im Konstruktor. Anderswo übergibst du den `DestroyRef`: `takeUntilDestroyed(this.destroyRef)`.

## Was nehme ich wann?

| Aufgabe | Werkzeug |
|---|---|
| Daten laden, die von Signals abhängen | `httpResource()` oder `rxResource()` |
| Ein Observable im Template oder in `computed()` nutzen | `toSignal()` |
| Zeit-Operatoren auf ein Signal anwenden | `toObservable()` + `toSignal()` |
| Bei jedem Wert eine Aktion ausführen | `subscribe()` mit `takeUntilDestroyed()` |

> [!TIP]
> Die `async`-Pipe (`{{ data$ | async }}`) wirst du in älterem Code oft sehen. Sie abonniert im Template. In neuem Code ist `toSignal()` meist die bessere Wahl, weil du den Wert dann auch in `computed()` und im Code verwenden kannst.

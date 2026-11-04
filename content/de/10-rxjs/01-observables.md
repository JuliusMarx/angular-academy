---
title: Observables
minutes: 8
summary: |-
  - Ein Observable liefert Werte über die Zeit: `next(wert)` beliebig oft, danach höchstens einmal `error()` oder `complete()`.
  - Es tut nichts, bis jemand `subscribe()` aufruft. Das `$` am Namensende ist eine Konvention für Observables.
  - Meist bekommst du Observables fertig: von `HttpClient`, aus `interval(1000)`, `of(1, 2, 3)` oder `fromEvent()`.
  - `subscribe()` gibt eine `Subscription` zurück, `unsubscribe()` beendet sie.
  - Ein `Subject` ist ein Observable, in das du selbst Werte schiebst. Für Zustand nimmst du heute statt `BehaviorSubject` ein Signal.
  - Signals für Zustand („was gilt gerade?“), Observables für Ereignisse über die Zeit („was passiert?“).

  ```ts
  start(): void {
    this.subscription = interval(1000).subscribe(() => this.seconds.update((s) => s + 1));
  }

  stop(): void {
    this.subscription?.unsubscribe();
  }
  ```

  > [!WARNING] Endlose Observables wie `interval()`, Events oder Subjects laufen weiter, auch wenn die Komponente weg ist. Melde dich spätestens mit `inject(DestroyRef).onDestroy(…)` ab, sonst entsteht ein Speicherleck.
quiz:
  - question: Was ist der wichtigste Unterschied zwischen einem Signal und einem Observable?
    options:
      - Observables sind schneller
      - Ein Signal hat immer einen aktuellen Wert, ein Observable liefert Werte über die Zeit
      - Signals funktionieren nur in Templates
      - Es gibt keinen
    answer: 1
  - question: "Was passiert mit `interval(1000)`, wenn niemand es abonniert?"
    options:
      - Es zählt trotzdem im Hintergrund
      - Gar nichts – es startet erst mit `subscribe()`
      - Angular abonniert es automatisch
      - Es wirft einen Fehler
    answer: 1
  - question: Wann musst du dich selbst abmelden (`unsubscribe()`)?
    options:
      - Nie
      - Bei Observables, die nicht von selbst enden, z. B. `interval()`
      - Nur bei HTTP-Anfragen
      - Nur bei `of()`
    answer: 1
    explanation: "HTTP-Observables enden nach der Antwort. `interval()`, Events oder Subjects laufen weiter, bis du dich abmeldest – sonst entsteht ein Speicherleck."
exercise:
  example: ex-stopwatch
  title: Eine Stoppuhr
  task: |-
    Baue mit `interval()` eine Stoppuhr, die alle 100 ms um 1 weiterzählt.

    1. **Start** abonniert `interval(100)` und erhöht bei jedem Wert `ticks`.
    2. **Stop** meldet die Subscription ab.
    3. Ein zweiter Klick auf **Start** darf kein zweites Intervall starten.
    4. Melde dich ab, wenn die Komponente zerstört wird (`DestroyRef`).
  checks:
    counts-up: Nach **Start** zählt die Anzeige hoch
    stops: Nach **Stop** bleibt die Anzeige stehen
    single-interval: Doppelt **Start** zählt nicht doppelt so schnell
---

# Observables

Ein Signal hat immer **einen** aktuellen Wert. Manche Dinge sind aber eher ein **Strom von Werten**: Klicks, Tastendrücke, ein Timer, Nachrichten von einem Server. Dafür nutzt Angular die Bibliothek **RxJS** mit ihrem zentralen Baustein, dem **Observable**. `HttpClient` hast du im letzten Kapitel schon damit verwendet.

## Werte über die Zeit

Ein Observable kann nacheinander drei Arten von Nachrichten senden:

- `next(wert)`: ein neuer Wert. Das kann beliebig oft passieren.
- `error(fehler)`: etwas ist schiefgegangen. Danach kommt nichts mehr.
- `complete()`: der Strom ist zu Ende. Danach kommt ebenfalls nichts mehr.

So sieht ein selbst gebautes Observable aus:

```ts
const countdown$ = new Observable<string>((subscriber) => {
  subscriber.next('3');
  const t1 = setTimeout(() => subscriber.next('2'), 500);
  const t2 = setTimeout(() => subscriber.complete(), 1000);
  return () => [t1, t2].forEach(clearTimeout); // Aufräumen
});
```

Das `$` am Ende des Namens ist eine Konvention: Es zeigt, dass die Variable ein Observable ist.

Meist baust du Observables nicht selbst, sondern bekommst sie: von `HttpClient`, aus Formularen oder von Funktionen wie `interval(1000)`, `of(1, 2, 3)` oder `fromEvent(button, 'click')`.

## Abonnieren

Ein Observable tut nichts, bis jemand es **abonniert**. `subscribe()` startet es und legt fest, was mit den Nachrichten passiert:

```ts
countdown$.subscribe({
  next: (value) => console.log('next', value),
  error: (err) => console.error(err),
  complete: () => console.log('fertig'),
});
```

Interessieren dich nur die Werte, reicht eine Funktion: `interval(1000).subscribe((n) => console.log(n))`.

## Abmelden

`subscribe()` gibt eine `Subscription` zurück. Mit `unsubscribe()` beendest du sie, und das Observable räumt auf (im Beispiel oben läuft die Aufräumfunktion):

```ts
private subscription?: Subscription;

start(): void {
  this.subscription = interval(1000).subscribe(() => this.seconds.update((s) => s + 1));
}

stop(): void {
  this.subscription?.unsubscribe();
}
```

> [!WARNING]
> Observables, die nicht von selbst enden, wie `interval()`, Events oder Subjects, laufen weiter, auch wenn die Komponente längst weg ist. Melde dich spätestens beim Zerstören der Komponente ab, sonst entsteht ein **Speicherleck**:
>
> ```ts
> inject(DestroyRef).onDestroy(() => this.subscription?.unsubscribe());
> ```
>
> In der dritten Lektion lernst du mit `takeUntilDestroyed()` und `toSignal()` Wege, bei denen Angular das für dich erledigt.

::tryit{rxjs-observables}

## Subjects

Ein **Subject** ist ein Observable, in das du selbst Werte hineinschieben kannst. Damit verbindest du zum Beispiel Events mit einer RxJS-Pipeline:

```ts
const clicks$ = new Subject<string>();
clicks$.subscribe((v) => console.log(v));
clicks$.next('hallo'); // → "hallo"
```

Ein `BehaviorSubject` merkt sich zusätzlich den letzten Wert und gibt ihn jedem neuen Abonnenten sofort. Bevor es Signals gab, war das der übliche Weg, Zustand in Services zu halten. Heute nimmst du dafür ein Signal.

> [!TIP]
> Gibt ein Service ein Subject nach außen, dann als `subject.asObservable()`. So kann nur der Service selbst Werte hineinschieben.

## Signals oder Observables?

| Merkmal | Signal | Observable |
|---|---|---|
| Hat immer einen Wert | ja | nein |
| Gut für | Zustand („was gilt gerade?“) | Ereignisse über die Zeit („was passiert?“) |
| Startet | sofort | beim Abonnieren |
| Abmelden nötig | nein | bei endlosen Strömen ja |

Beide ergänzen sich. Für Zustand nimmst du Signals, für Zeit, Ereignisse und asynchrone Abläufe Observables. Die nächsten Lektionen zeigen, wie die Operatoren von RxJS solche Abläufe steuern und wie du zwischen beiden Welten wechselst.

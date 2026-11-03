---
title: Operatoren
minutes: 9
quiz:
  - question: "Was macht `debounceTime(300)`?"
    options:
      - Es verzögert jeden Wert um 300 ms
      - Es gibt einen Wert erst weiter, wenn 300 ms lang kein neuer kam
      - Es lässt höchstens alle 300 ms einen Wert durch und verwirft den Rest sofort
      - Es bricht nach 300 ms ab
    answer: 1
  - question: Ein Nutzer tippt schnell, die Antworten kommen in falscher Reihenfolge. Welcher Operator verhindert, dass eine alte Antwort die neue überschreibt?
    options: ["mergeMap", "concatMap", "switchMap", "map"]
    answer: 2
    explanation: "`switchMap` meldet sich beim alten inneren Observable ab, sobald ein neuer Wert kommt. Die alte Anfrage wird abgebrochen, ihre Antwort kommt nie an."
  - question: "Was gibt `of(1, 2, 3, 4).pipe(filter((n) => n % 2 === 0), map((n) => n * 10))` aus?"
    options: ["10, 20, 30, 40", "20, 40", "2, 4", "10, 30"]
    answer: 1
exercise:
  example: ex-search-pipeline
  title: Eine sparsame Suche
  task: |-
    Die Suche schickt bei jedem Tastendruck eine Anfrage. Ergänze die Pipeline vor `switchMap`:

    1. `map` mit `trim()`: Leerzeichen am Rand zählen nicht.
    2. `filter`: Weniger als 2 Zeichen schicken keine Anfrage.
    3. `debounceTime(300)`: Erst nach einer Tipp-Pause wird gesucht.
    4. `distinctUntilChanged()`: Dieselbe Suche wird nicht zweimal hintereinander geschickt.
  checks:
    finds-country: "`germ` findet Germany"
    ignores-short: Ein einzelner Buchstabe schickt keine Anfrage
    debounces: Schnelles Tippen schickt nur eine Anfrage
    no-duplicates: "`spain` mit Leerzeichen wird nicht erneut gesucht"
---

# Operatoren

Die Stärke von RxJS sind die **Operatoren**: kleine Bausteine, die einen Strom verändern. Du steckst sie mit `pipe()` hintereinander, und jeder Wert läuft der Reihe nach durch alle hindurch.

## pipe, map und filter

```ts
import { filter, map, of } from 'rxjs';

of(1, 2, 3, 4)
  .pipe(
    filter((n) => n % 2 === 0), // nur gerade Zahlen
    map((n) => n * 10),          // jede mal 10
  )
  .subscribe(console.log);       // → 20, 40
```

`pipe()` ändert das ursprüngliche Observable nicht, sondern gibt ein **neues** zurück. Wie bei Arrays gibt es `map` und `filter`, nur eben für Werte, die nacheinander eintreffen.

`tap()` lässt die Werte unverändert durch und ist praktisch, um mal hineinzuschauen: `tap((v) => console.log('Wert:', v))`.

## Zeit steuern

Manche Operatoren arbeiten mit der Zeit, und hier zeigt RxJS, was es kann:

| Operator | Wirkung |
|---|---|
| `debounceTime(ms)` | gibt einen Wert erst weiter, wenn `ms` lang kein neuer kam |
| `throttleTime(ms)` | lässt höchstens einen Wert pro `ms` durch |
| `distinctUntilChanged()` | verwirft einen Wert, wenn er gleich dem vorigen ist |
| `delay(ms)` | verzögert jeden Wert |
| `take(n)` | nimmt die ersten `n` Werte, dann ist Schluss |

## Ein Observable pro Wert: switchMap

Für eine Suche brauchst du zu jeder Eingabe eine HTTP-Anfrage, also ein **neues Observable pro Wert**. Dafür gibt es die `…Map`-Operatoren:

```ts
query$.pipe(
  map((q) => q.trim()),
  filter((q) => q.length >= 2),
  debounceTime(300),
  distinctUntilChanged(),
  switchMap((q) => this.countries.search(q)),
);
```

`switchMap` meldet sich beim alten Observable ab, sobald ein neuer Wert kommt. Eine noch laufende Anfrage wird also **abgebrochen**. So kann eine langsame alte Antwort nie die Ergebnisse einer neueren Suche überschreiben.

::tryit{rxjs-operators}

Tippe im Beispiel schnell ein Wort und beobachte den Zähler: Statt einer Anfrage pro Tastendruck geht nur eine raus. Ändere die Pipeline und schau, was passiert, wenn du `debounceTime` entfernst.

Die vier `…Map`-Operatoren unterscheiden sich darin, was mit einem noch laufenden Observable passiert:

| Operator | Wenn ein neuer Wert kommt … | Typischer Einsatz |
|---|---|---|
| `switchMap` | … wird das alte abgebrochen | Suche, Laden nach Auswahl |
| `mergeMap` | … laufen beide parallel | unabhängige Anfragen |
| `concatMap` | … wartet der neue, bis das alte fertig ist | Speichern in fester Reihenfolge |
| `exhaustMap` | … wird der neue ignoriert | Doppelklick auf „Absenden“ |

## Fehler und Wiederholung

Aus dem HTTP-Kapitel kennst du schon `catchError` und `retry`. Wichtig in einer Pipeline: Ein Fehler **beendet** den Strom. Fängst du ihn außen ab, funktioniert die Suche danach nicht mehr. Fang ihn deshalb **innerhalb** von `switchMap` ab:

```ts
switchMap((q) =>
  this.countries.search(q).pipe(catchError(() => of([]))), // Suche bleibt aktiv
);
```

> [!TIP]
> Du musst nicht alle über 100 Operatoren kennen. Mit `map`, `filter`, `tap`, `debounceTime`, `distinctUntilChanged`, `switchMap` und `catchError` kommst du in Angular-Anwendungen sehr weit.

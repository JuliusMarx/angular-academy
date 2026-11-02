---
title: Eigene Pipes schreiben
minutes: 8
quiz:
  - question: Welche Methode muss ein Pipe implementieren?
    options: [format, transform, pipe, render]
    answer: 1
  - question: "Wie übergibst du zwei Parameter an ein Pipe truncate?"
    options: ["truncate(30, '…')", "truncate: 30, '…'", "truncate: 30 : '…'", "truncate[30]['…']"]
    answer: 2
  - question: Wann ruft Angular ein normales (pures) Pipe erneut auf?
    options:
      - Bei jeder Änderungserkennung
      - Nur wenn sich der Eingabewert oder ein Parameter ändert
      - Nur einmal beim Start
      - Jede Sekunde
    answer: 1
    explanation: Bei Objekten und Arrays zählt die Referenz – ein geändertes Array mit `push()` erkennt ein pures Pipe nicht.
---

# Eigene Pipes schreiben

Die eingebauten Pipes decken viel ab, aber nicht alles: Texte kürzen, Initialen bilden, Dateigrößen lesbar machen. Ein eigenes Pipe ist schnell geschrieben – und im Template viel lesbarer als ein Methodenaufruf.

## Ein Pipe mit @Pipe

```ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'initials' })
export class InitialsPipe implements PipeTransform {
  transform(name: string): string {
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return (first + last).toUpperCase();
  }
}
```

- `name` ist der Name, unter dem du das Pipe im Template aufrufst.
- `transform()` bekommt den Wert vor dem `|` und gibt das Ergebnis zurück.

```ts
@Component({
  imports: [InitialsPipe],
  template: `{{ 'Grace Brewster Hopper' | initials }}`, // GH
})
```

## Parameter

Weitere Parameter von `transform()` übergibst du im Template mit Doppelpunkten:

```ts
@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {
  transform(value: string, max = 30, suffix = '…'): string {
    if (value.length <= max) return value;
    const cut = value.slice(0, max);
    return cut.slice(0, cut.lastIndexOf(' ')) + suffix;
  }
}
```

```html
{{ text | truncate }}               <!-- Standard: 30 Zeichen -->
{{ text | truncate: 40 }}           <!-- 40 Zeichen -->
{{ text | truncate: 40 : ' [mehr]' }} <!-- eigenes Suffix -->
```

## Pipes verketten

Das Ergebnis eines Pipes ist die Eingabe des nächsten:

```html
{{ author | uppercase | truncate: 12 }}
```

::tryit{custom-pipes}

## Pur oder nicht pur?

Normale Pipes sind **pur**: Angular ruft `transform()` nur erneut auf, wenn sich der Eingabewert oder ein Parameter ändert. Das macht Pipes sehr effizient – viel effizienter als einen Methodenaufruf im Template, der bei jeder Änderungserkennung läuft.

Bei Objekten und Arrays zählt dabei die **Referenz**:

```ts
this.items().push(neu);                          // ❌ gleiche Referenz – das Pipe merkt nichts
this.items.update((list) => [...list, neu]);     // ✅ neues Array – das Pipe rechnet neu
```

Mit `@Pipe({ name: 'x', pure: false })` läuft ein Pipe bei jeder Änderungserkennung. Das brauchst du fast nie – und es kostet Leistung.

> [!TIP]
> Wenn du ohnehin mit Signals arbeitest, ist ein `computed()` in der Klasse oft die bessere Wahl als ein Pipe. Pipes lohnen sich vor allem für Formatierungen, die du in vielen Komponenten brauchst.

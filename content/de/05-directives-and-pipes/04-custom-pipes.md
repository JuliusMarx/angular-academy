---
title: Eigene Pipes schreiben
minutes: 8
summary: |-
  - Ein eigenes Pipe ist eine Klasse mit `@Pipe({ name: '…' })`, die `PipeTransform` implementiert.
  - `transform()` bekommt den Wert vor dem `|` und gibt das Ergebnis zurück. Weitere Parameter übergibst du mit Doppelpunkten: `truncate: 40 : ' [mehr]'`.
  - Pipes lassen sich verketten: Das Ergebnis des einen ist die Eingabe des nächsten.
  - Normale Pipes sind pur: `transform()` läuft nur neu, wenn sich Eingabewert oder Parameter ändern. Bei Objekten und Arrays zählt die Referenz.
  - `pure: false` läuft bei jeder Änderungserkennung – brauchst du fast nie.
  - Arbeitest du mit Signals, ist ein `computed()` oft die bessere Wahl. Pipes lohnen sich für Formatierungen, die viele Komponenten brauchen.

  ```ts
  @Pipe({ name: 'truncate' })
  export class TruncatePipe implements PipeTransform {
    transform(value: string, max = 30, suffix = '…'): string {
      if (value.length <= max) return value;
      const cut = value.slice(0, max);
      const lastSpace = cut.lastIndexOf(' ');
      return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut) + suffix;
    }
  }
  ```

  > [!WARNING] `this.items().push(neu)` behält die Referenz – ein pures Pipe merkt nichts. Erzeuge ein neues Array mit `update((list) => [...list, neu])`.
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
exercise:
  example: ex-custom-pipe
  title: Dateigrößen lesbar machen
  task: |-
    Die Download-Liste zeigt rohe Byte-Zahlen. Schreib ein Pipe `fileSize` in `file-size.pipe.ts` und verwende es in der Größen-Spalte:

    | Eingabe | Ausgabe |
    |---|---|
    | `512` | `512 B` |
    | `1536` | `1.5 KB` |
    | `1024` | `1 KB` |
    | `1048576` | `1 MB` |
    | `1610612736` | `1.5 GB` |

    Höchstens eine Nachkommastelle, und kein `.0` am Ende.
  checks:
    bytes: '`512` wird zu `512 B`'
    kilobytes: '`1536` wird zu `1.5 KB`, `1024` zu `1 KB`'
    larger-units: 'Auch MB und GB stimmen: `1 MB`, `1.5 GB`'
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
    const lastSpace = cut.lastIndexOf(' ');
    return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut) + suffix;
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

---
title: Unit-Tests und Services
minutes: 9
summary: |-
  - Neue Angular-Projekte testen mit **Vitest**. Tests liegen in `.spec.ts`-Dateien neben dem Code, `ng test` startet sie.
  - `describe` gruppiert Tests, `it` ist ein einzelner Test, `expect(wert)` prüft mit einem Matcher.
  - `toBe()` für Zahlen, Strings und Booleans, `toEqual()` für Objekte und Arrays. `.not` dreht jeden Matcher um.
  - `TestBed.inject(Service)` erzeugt einen Service wie in der App. Nach jedem Test wird das `TestBed` zurückgesetzt.
  - Abhängigkeiten ersetzt du mit `{ provide, useValue }`, Aufrufe prüfst du mit `vi.fn()` und `toHaveBeenCalledWith()`.

  ```ts
  const save = vi.fn();
  TestBed.configureTestingModule({ providers: [{ provide: Storage, useValue: { save } }] });

  TestBed.inject(Settings).setTheme('dark');
  expect(save).toHaveBeenCalledWith('theme', 'dark');
  ```

  > [!TIP] Mach einen Test zur Probe kaputt. Schlägt er dann nicht fehl, prüft er weniger, als du denkst.
quiz:
  - question: Wofür ist `TestBed.inject(Cart)` gut?
    options:
      - Es erzeugt den Service wie in der App, mit allen Abhängigkeiten
      - Es startet die ganze Anwendung
      - Es ersetzt den Service durch einen Mock
      - Es ist nur für Komponenten nötig
    answer: 0
  - question: "Was ist der Unterschied zwischen `toBe` und `toEqual`?"
    options:
      - Es gibt keinen
      - "`toBe` vergleicht die Identität, `toEqual` den Inhalt"
      - "`toEqual` ist nur für Zahlen"
      - "`toBe` ist veraltet"
    answer: 1
    explanation: "`expect([1]).toBe([1])` schlägt fehl, weil es zwei verschiedene Arrays sind. `toEqual` vergleicht den Inhalt und ist erfolgreich."
  - question: Warum ersetzt man eine Abhängigkeit im Test durch einen Stellvertreter?
    options:
      - Weil Tests sonst nicht kompilieren
      - Damit der Test nur die eine Klasse prüft und das Verhalten der Abhängigkeit selbst festlegt
      - Weil Angular es verlangt
      - Damit der Test langsamer läuft
    answer: 1
exercise:
  example: ex-test-service
  title: Tests für eine Todo-Liste
  task: |-
    Schreibe in `todo-list.spec.ts` Tests für den Service `TodoList`:

    1. `add()` legt ein offenes Todo mit dem richtigen Titel an.
    2. `toggle()` markiert ein Todo als erledigt, `remaining()` sinkt.
    3. `clearCompleted()` entfernt **nur** die erledigten Todos.

    Die Prüfung lässt deine Tests auch gegen absichtlich kaputte Versionen von `TodoList` laufen. Gute Tests schlagen dann fehl.
  checks:
    tests-pass: Deine Tests laufen gegen die echte `TodoList` durch
    catches-add-bug: Ein Test bemerkt, wenn `add()` Todos als erledigt anlegt
    catches-toggle-bug: Ein Test bemerkt, wenn `toggle()` nichts tut
    catches-clear-bug: Ein Test bemerkt, wenn `clearCompleted()` alles löscht
---

# Unit-Tests und Services

Ein **Unit-Test** prüft einen kleinen Teil deiner App für sich, etwa einen Service oder eine Funktion. Er läuft in Millisekunden, und du kannst ihn nach jeder Änderung wiederholen. So merkst du sofort, wenn du etwas kaputt gemacht hast, nicht erst der Nutzer.

## Tests ausführen

Neue Angular-Projekte testen mit **Vitest**. Tests liegen in Dateien mit der Endung `.spec.ts` neben dem Code, und `ng test` startet sie:

```bash
ng test
```

Vitest beobachtet die Dateien und führt bei jeder Änderung die betroffenen Tests erneut aus.

> [!NOTE]
> In den Live-Beispielen laufen die Tests direkt in der Vorschau, mit einem kleinen Runner, der dieselben Funktionen (`describe`, `it`, `expect`, `vi`) und Angulars echtes `TestBed` verwendet. Die Spec-Dateien sehen genauso aus wie in deinem Projekt. Nur die Datei `src/specs.ts`, in der die Specs aufgelistet sind, brauchst du dort nicht.

## Der Aufbau eines Tests

```ts
describe('formatPrice', () => {
  it('shows two decimals', () => {
    expect(formatPrice(4)).toBe('€4.00');
  });
});
```

- `describe` fasst zusammengehörige Tests zu einer Gruppe zusammen.
- `it` ist ein einzelner Test. Der Name beschreibt das erwartete Verhalten, zusammen ergibt sich ein Satz: „formatPrice shows two decimals“.
- `expect(wert)` mit einem **Matcher** prüft das Ergebnis. Stimmt es nicht, schlägt der Test fehl.

Die wichtigsten Matcher:

| Matcher | Prüft |
|---|---|
| `toBe(x)` | Identität (`Object.is`, fast wie `===`), für Zahlen, Strings und Booleans |
| `toEqual(x)` | gleicher Inhalt, für Objekte und Arrays |
| `toBeTruthy()` / `toBeFalsy()` | Wahrheitswert |
| `toContain(x)` | Array oder String enthält `x` |
| `toHaveLength(n)` | Länge |
| `toThrow()` | Funktion wirft einen Fehler |

Mit `.not` drehst du jeden Matcher um: `expect(list).not.toContain('Ada')`.

## Services testen

Services erzeugst du mit `TestBed`. Es baut einen Injector wie in der App, deshalb funktioniert `inject()` im Service auch im Test:

```ts
describe('Cart', () => {
  let cart: Cart;

  beforeEach(() => {
    cart = TestBed.inject(Cart);
  });

  it('multiplies price and quantity', () => {
    cart.add({ name: 'Coffee', price: 3, quantity: 2 });
    expect(cart.total()).toBe(6);
  });
});
```

`beforeEach` läuft vor **jedem** Test. Nach jedem Test setzt Angular das `TestBed` zurück. So bekommt jeder Test einen frischen Service, und kein Test hängt vom Zustand eines anderen ab.

## Abhängigkeiten ersetzen

Hängt ein Service von einem anderen ab, ersetzt du diesen im Test durch einen **Stellvertreter**. Der Test prüft dann nur die eine Klasse, und du legst fest, was die Abhängigkeit liefert:

```ts
TestBed.configureTestingModule({
  providers: [{ provide: Coupons, useValue: { discount: signal(0.1) } }],
});
const cart = TestBed.inject(Cart);
```

Willst du prüfen, **ob** und **wie** eine Funktion aufgerufen wurde, nimmst du eine Mock-Funktion:

```ts
const save = vi.fn();
TestBed.configureTestingModule({ providers: [{ provide: Storage, useValue: { save } }] });

TestBed.inject(Settings).setTheme('dark');
expect(save).toHaveBeenCalledWith('theme', 'dark');
```

::tryit{testing-basics}

> [!TIP]
> Mach einen Test zur Probe kaputt, ändere etwa die erwartete Zahl. Schlägt er dann nicht fehl, prüft er weniger, als du denkst. Genau so arbeitet die Prüfung der Übung unten: Sie baut Fehler in den Code ein und schaut, ob deine Tests sie finden.

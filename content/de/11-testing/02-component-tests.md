---
title: Komponenten testen
minutes: 9
summary: |-
  - `TestBed.createComponent()` rendert die Komponente und gibt eine **Fixture** zurück.
  - `fixture.nativeElement` ist das DOM-Element, `fixture.componentInstance` die Klasseninstanz, `fixture.componentRef` der Zugriff von außen.
  - Teste, was der Nutzer sieht (das DOM), nicht die inneren Felder der Klasse.
  - Nach einem Klick wartest du mit `await fixture.whenStable()`, bis Angular das DOM aktualisiert hat.
  - Inputs setzt du mit `fixture.componentRef.setInput()`, Outputs abonnierst du mit einer `vi.fn()`.
  - Finde Elemente über ihren Text oder ihr `aria-label`, nicht über ihre Position.

  ```ts
  it('counts up on click', async () => {
    button('+').click();
    await fixture.whenStable();
    expect(element.querySelector('output')?.textContent).toBe('1');
  });
  ```

  > [!WARNING] Ohne `await fixture.whenStable()` siehst du noch das alte DOM, und der Test schlägt fehl, obwohl die Komponente richtig arbeitet.
quiz:
  - question: "Was liefert `TestBed.createComponent(Counter)`?"
    options:
      - Den HTML-Code der Komponente als String
      - Eine `ComponentFixture` mit der Instanz und dem gerenderten Element
      - Nur die Instanz der Klasse
      - Einen Screenshot
    answer: 1
  - question: Warum steht nach einem Klick `await fixture.whenStable()`?
    options:
      - Damit der Klick ankommt
      - Damit Angular das DOM aktualisiert, bevor der Test es prüft
      - Weil Tests immer async sein müssen
      - Um Fehler abzufangen
    answer: 1
  - question: Wie setzt du im Test einen Input der Komponente?
    options:
      - "`fixture.componentInstance.max = 3`"
      - "`fixture.componentRef.setInput('max', 3)`"
      - "`fixture.nativeElement.max = 3`"
      - Gar nicht
    answer: 1
    explanation: "Signal-Inputs sind von außen schreibgeschützt. `setInput()` setzt den Input so, wie es ein Eltern-Template tun würde."
exercise:
  example: ex-test-component
  title: Tests für eine Sternebewertung
  task: |-
    Schreibe in `rating.spec.ts` Tests für die Komponente `Rating`:

    1. Mit `setInput('value', 3)` zeigt das Label „3 / 5“.
    2. Ein Klick auf Stern 4 ändert das Label auf „4 / 5“.
    3. Ein Klick auf Stern 2 gibt über `rated` den Wert 2 aus.

    Auch hier laufen deine Tests zusätzlich gegen kaputte Versionen der Komponente.
  checks:
    tests-pass: Deine Tests laufen gegen die echte Komponente durch
    catches-input-bug: Ein Test bemerkt, wenn der Input ignoriert wird
    catches-click-bug: Ein Test bemerkt, wenn ein Klick das Label nicht ändert
    catches-emit-bug: Ein Test bemerkt, wenn `rated` nie ausgegeben wird
---

# Komponenten testen

Bei einer Komponente willst du wissen: Zeigt sie das Richtige an, und reagiert sie richtig auf den Nutzer? Dafür rendert `TestBed` die Komponente wirklich, und der Test bedient sie wie ein Nutzer.

## Die Fixture

`TestBed.createComponent()` erzeugt die Komponente und gibt eine **Fixture** zurück:

```ts
let fixture: ComponentFixture<Counter>;
let element: HTMLElement;

beforeEach(async () => {
  fixture = TestBed.createComponent(Counter);
  element = fixture.nativeElement; // das gerenderte <app-counter>
  await fixture.whenStable();      // warten, bis Angular gerendert hat
});
```

| Eigenschaft | Inhalt |
|---|---|
| `fixture.nativeElement` | das DOM-Element der Komponente |
| `fixture.componentInstance` | die Instanz der Klasse |
| `fixture.componentRef` | Zugriff von außen, z. B. `setInput()` |

## Das DOM prüfen

Teste, was der **Nutzer sieht**, nicht die inneren Felder der Klasse. Dann bleiben die Tests gültig, auch wenn du die Komponente intern umbaust:

```ts
it('starts at 0', () => {
  expect(element.querySelector('output')?.textContent).toBe('0');
});
```

## Bedienen und warten

Ein Klick auf einen Button löst den Event-Handler aus. Das DOM aktualisiert Angular aber erst danach. Deshalb wartest du mit `whenStable()`, bevor du prüfst:

```ts
it('counts up on click', async () => {
  button('+').click();
  await fixture.whenStable();
  expect(element.querySelector('output')?.textContent).toBe('1');
});
```

> [!WARNING]
> Ohne `await fixture.whenStable()` siehst du noch das alte DOM, und der Test schlägt fehl, obwohl die Komponente richtig arbeitet. Das ist einer der häufigsten Fehler in Komponententests.

## Inputs und Outputs

Inputs setzt du mit `setInput()`, so wie es ein Eltern-Template tun würde:

```ts
fixture.componentRef.setInput('max', 2);
await fixture.whenStable();
```

Ein Output ist von außen abonnierbar. Mit einer Mock-Funktion prüfst du, was ausgegeben wurde:

```ts
const changed = vi.fn();
fixture.componentInstance.changed.subscribe(changed);
button('+').click();
expect(changed).toHaveBeenCalledWith(1);
```

::tryit{testing-components}

> [!TIP]
> Finde Elemente so, wie ein Nutzer sie findet: über ihren Text oder ihr `aria-label`. Ein Test, der `button('+')` sucht, prüft nebenbei, dass der Button eine sinnvolle Beschriftung hat. Ein Test mit `querySelectorAll('button')[1]` bricht dagegen, sobald sich die Reihenfolge ändert.

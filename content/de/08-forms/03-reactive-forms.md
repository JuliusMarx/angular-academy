---
title: Reactive Forms
minutes: 8
quiz:
  - question: Welche Direktive verbindet ein `<input>` mit einem Control in einem `FormGroup`?
    options: ["formControlName", "[formField]", "ngModel", "[control]"]
    answer: 0
  - question: Was bewirkt `fb.nonNullable.group(...)`?
    options:
      - Die Felder dürfen nicht leer sein
      - "`reset()` setzt die Felder auf ihre Startwerte statt auf `null`"
      - Das Formular wird schreibgeschützt
      - Es aktiviert die Validierung
    answer: 1
  - question: Welche Formular-Variante empfiehlt Angular für neue Formulare?
    options: ["Template-driven Forms mit ngModel", "Reactive Forms", "Signal Forms", "Eigene Event-Handler"]
    answer: 2
    explanation: "Für neuen Code sind Signal Forms die erste Wahl. Reactive Forms bleiben wichtig, weil es viel bestehenden Code damit gibt."
exercise:
  example: ex-reactive-form
  title: Ein Login mit Reactive Forms
  task: |-
    Baue das Login-Formular mit Reactive Forms:

    1. Lege mit `fb.nonNullable.group()` ein `FormGroup` `login` an. `email` ist Pflicht und eine gültige E-Mail-Adresse, `password` ist Pflicht und hat mindestens 6 Zeichen.
    2. Importiere `ReactiveFormsModule`.
    3. Verbinde das `<form>` mit `[formGroup]` und `(ngSubmit)="logIn()"`, die Eingabefelder mit `formControlName`.
    4. Sperre den Button, solange das Formular ungültig ist.
    5. Zeige in `logIn()` „Logged in as …“ mit der E-Mail-Adresse an und setze das Formular zurück.
  checks:
    disabled-when-empty: Der Button ist gesperrt, solange das Formular leer ist
    validators: Ungültige E-Mail und zu kurzes Passwort halten den Button gesperrt
    submit-and-reset: Absenden zeigt die E-Mail-Adresse und leert das Formular
---

# Reactive Forms

Vor den Signal Forms gab es zwei Arten, Formulare zu bauen: **Reactive Forms** und **Template-driven Forms**. Beide wirst du in bestehenden Projekten oft finden. Reactive Forms sind die verbreitetere davon. Diese Lektion zeigt, wie sie funktionieren und wie sie sich von Signal Forms unterscheiden.

## FormGroup und FormControl

Bei Reactive Forms beschreibst du das Formular als Objekte im Code. Jedes Feld ist ein `FormControl`, mehrere zusammen bilden ein `FormGroup`. Am bequemsten geht das mit dem `FormBuilder`:

```ts
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

private readonly fb = inject(FormBuilder);

protected readonly contact = this.fb.nonNullable.group({
  name: ['', Validators.required],
  email: ['', [Validators.required, Validators.email]],
  message: ['', [Validators.required, Validators.minLength(10)]],
});
```

Jeder Eintrag ist `[Startwert, Validatoren]`. Mit `nonNullable` setzt `reset()` die Felder wieder auf ihre Startwerte, sonst würden sie `null`.

## Das Template verbinden

`[formGroup]` verbindet das `<form>` mit der Gruppe, `formControlName` jedes Eingabefeld mit seinem Control:

```html
<form [formGroup]="contact" (ngSubmit)="send()">
  <input formControlName="name" />
  @if (contact.controls.name.touched && contact.controls.name.hasError('required')) {
    <small>Bitte gib deinen Namen ein.</small>
  }
  <button type="submit" [disabled]="contact.invalid">Senden</button>
</form>
```

- Nicht vergessen: `ReactiveFormsModule` gehört in die `imports` der Komponente.
- `(ngSubmit)` verhindert das Neuladen der Seite selbst. `preventDefault()` brauchst du hier nicht.
- Die Fehlernamen sind kleingeschrieben: `required`, `email`, `minlength`.

Den Wert liest du mit `contact.value` oder, vollständig typisiert, mit `contact.getRawValue()`.

::tryit{forms-reactive}

> [!NOTE]
> `value`, `valid` und `touched` sind bei Reactive Forms **keine Signals**, sondern einfache Eigenschaften. Änderungen kommen als Observables (`valueChanges`, `statusChanges`). In Komponenten mit Signals ist das umständlicher, und genau das lösen Signal Forms.

## Template-driven Forms

Die dritte Variante steckt das Formular ganz ins Template, mit `ngModel` aus dem `FormsModule`:

```html
<input name="name" [(ngModel)]="name" required />
```

Das ist für sehr kleine Formulare schnell geschrieben. Validierung und Typen lassen sich aber schlechter kontrollieren. Für neuen Code solltest du sie nicht mehr verwenden.

## Welche Variante wann?

| Merkmal | Signal Forms | Reactive Forms | Template-driven |
|---|---|---|---|
| Daten liegen in | einem Signal | `FormGroup`-Objekten | Komponenten-Feldern |
| Regeln stehen in | einer Schema-Funktion | dem Code (`Validators`) | Template-Attributen |
| Zustand als | Signals | Eigenschaften und Observables | Eigenschaften |
| Für neuen Code | **erste Wahl** | wenn das Projekt sie schon nutzt | nicht mehr empfohlen |

> [!TIP]
> Bestehende Reactive Forms musst du nicht sofort umbauen. Beide Varianten können in einem Projekt nebeneinander existieren. Neue Formulare schreibst du mit Signal Forms.

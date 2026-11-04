---
title: Validierung
minutes: 9
quiz:
  - question: Wo legst du bei Signal Forms die Regeln fest?
    options:
      - Als Attribute im Template, z. B. `required`
      - In einer Schema-Funktion, dem zweiten Argument von `form()`
      - In einem eigenen Service
      - In der CSS-Datei
    answer: 1
  - question: "Das Feld `password` hat nur `minLength(path.password, 8)`. Ist ein leeres Passwort gültig?"
    options: ["Ja", "Nein"]
    answer: 0
    explanation: "Längenregeln prüfen leere Werte nicht. Soll das Feld ausgefüllt sein, brauchst du zusätzlich `required()`."
  - question: Wie liest eine eigene Regel mit `validate()` den Wert eines anderen Felds?
    options: ["Mit `this.model()`", "Mit `valueOf(path.anderesFeld)`", "Mit `inject()`", "Gar nicht"]
    answer: 1
exercise:
  example: ex-validation
  title: Ein Registrierungsformular prüfen
  task: |-
    Das Formular nimmt bisher alles an. Gib `form()` eine Schema-Funktion als zweites Argument und lege diese Regeln fest:

    1. `email` ist Pflicht und muss eine gültige E-Mail-Adresse sein.
    2. `password` ist Pflicht und hat mindestens 8 Zeichen.
    3. `confirm` muss gleich `password` sein. Schreibe dafür eine eigene Regel mit `validate()` und dem Fehler-`kind` `'mismatch'`.
  checks:
    email-required: Eine leere E-Mail zeigt einen `required`-Fehler
    email-format: "`ada@` zeigt einen `email`-Fehler"
    password-length: Zu kurze und leere Passwörter werden abgelehnt
    passwords-match: Ungleiche Passwörter zeigen `mismatch`, gleiche lassen sich absenden
---

# Validierung

Ein Formular soll nur Daten annehmen, die stimmen. Bei Signal Forms legst du die Regeln **einmal** fest, in einer Schema-Funktion. Angular prüft dann bei jeder Eingabe neu und hält `valid()` und `errors()` aktuell.

## Die Schema-Funktion

`form()` nimmt als zweites Argument eine Funktion. Sie bekommt `path`, eine Beschreibung aller Felder, und ruft darauf die Regeln auf:

```ts
import { email, form, min, minLength, required } from '@angular/forms/signals';

protected readonly reg = form(this.model, (path) => {
  required(path.name, { message: 'Bitte gib deinen Namen ein.' });
  required(path.email);
  email(path.email, { message: 'Das ist keine gültige E-Mail-Adresse.' });
  min(path.age, 16, { message: 'Du musst mindestens 16 sein.' });
  minLength(path.password, 8);
});
```

Die eingebauten Regeln:

| Regel | Fehler-`kind` |
|---|---|
| `required(path)` | `required` |
| `email(path)` | `email` |
| `min(path, n)` / `max(path, n)` | `min` / `max` |
| `minLength(path, n)` / `maxLength(path, n)` | `minLength` / `maxLength` |
| `pattern(path, /regex/)` | `pattern` |

> [!WARNING]
> `minLength`, `email` und `pattern` prüfen **leere** Werte nicht. Ein leeres Passwort besteht also `minLength(8)`. Soll ein Feld ausgefüllt sein, brauchst du zusätzlich `required()`.

## Fehler anzeigen

`errors()` liefert eine Liste von Fehlern. Jeder hat ein `kind` und, falls du sie angegeben hast, eine `message`. Zeig sie erst, wenn der Nutzer das Feld verlassen hat (`touched()`). Sonst ist das Formular schon beim Öffnen voller Fehler:

```html
<input [formField]="reg.email" />
@if (reg.email().touched() && reg.email().invalid()) {
  @for (error of reg.email().errors(); track error.kind) {
    <small class="error">{{ error.message }}</small>
  }
}
```

Weil sich das in jedem Feld wiederholt, lohnt eine kleine Komponente, die ein Feld als Input bekommt (`input.required<FieldTree<unknown>>()`). Das Beispiel unten macht es so.

## Eigene Regeln

Für alles andere gibt es `validate()`. Die Funktion bekommt den Kontext des Felds und gibt einen Fehler zurück, oder `undefined`, wenn alles stimmt. Mit `valueOf()` liest sie den Wert eines **anderen** Felds, etwa für „Passwort wiederholen“:

```ts
validate(path.confirm, ({ value, valueOf }) =>
  value() !== valueOf(path.password)
    ? { kind: 'mismatch', message: 'Die Passwörter stimmen nicht überein.' }
    : undefined,
);
```

Weil `valueOf()` ein Signal liest, prüft Angular die Regel automatisch neu, sobald sich das Passwort ändert.

::tryit{forms-validation}

## Absenden mit Prüfung

`submit()` markiert alle bearbeitbaren Felder als `touched`, damit jetzt alle Fehler sichtbar werden. Die Aktion läuft nur, wenn das Formular gültig ist. Solange sie läuft, ist `submitting()` `true`. Damit kannst du den Button sperren und doppeltes Absenden verhindern:

```html
<button type="submit" [disabled]="reg().submitting()">
  {{ reg().submitting() ? 'Speichert …' : 'Konto anlegen' }}
</button>
```

> [!NOTE]
> Wie Guards im Router ersetzt Validierung im Browser keine Prüfung auf dem Server. Sie sorgt für schnelles Feedback, die Regeln muss der Server trotzdem selbst durchsetzen.

---
title: Signal Forms
minutes: 8
summary: |-
  - Signal Forms (`@angular/forms/signals`) gibt es seit Angular 21, stabil sind sie seit Angular 22.
  - Das Model ist ein normales Signal. `form(this.model)` macht daraus einen typisierten Feldbaum mit denselben Feldern.
  - `[formField]="signupForm.name"` (Direktive `FormField`) bindet ein Eingabeelement in beide Richtungen: Eingaben landen im Model, `model.set(...)` aktualisiert die Felder.
  - Ein Feld aufgerufen liefert seinen Zustand als Signals: `value()`, `touched()`, `dirty()`, `valid()`/`invalid()`, `errors()`.
  - `submit()` führt deine Aktion nur bei gültigem Formular aus und markiert vorher alle Felder als `touched`.
  - Die Daten stehen immer im Model: `this.model()` ist der aktuelle Stand.

  ```ts
  protected readonly model = signal<Signup>({ name: '', email: '', weekly: false });
  protected readonly signupForm = form(this.model);
  ```

  ```html
  <input [formField]="signupForm.name" />
  ```
quiz:
  - question: Woher bekommt `form()` seine Werte?
    options:
      - Aus den `value`-Attributen im Template
      - Aus dem Signal, das du übergibst
      - Aus einem FormGroup
      - Aus dem LocalStorage
    answer: 1
    explanation: "Das Signal ist die einzige Quelle der Wahrheit. Das Formular liest daraus und schreibt Eingaben direkt hinein."
  - question: Wie verbindest du ein `<input>` mit dem Feld `name`?
    options: ['[formField]="profile.name"', 'formControlName="name"', '[(ngModel)]="name"', '[value]="profile.name()"']
    answer: 0
  - question: Was passiert, wenn du das Model-Signal per `set()` änderst?
    options:
      - Nichts – das Formular merkt es nicht
      - Die Felder zeigen sofort die neuen Werte
      - Das Formular wird zurückgesetzt und ungültig
      - Angular wirft einen Fehler
    answer: 1
exercise:
  example: ex-signal-form
  title: Ein Profil-Formular
  task: |-
    Die Eingabefelder sind noch nicht mit dem Model verbunden – die Vorschau bleibt leer.

    1. Lege mit `form(this.model)` ein Formular `profile` an.
    2. Verbinde Name, Stadt und Checkbox mit `[formField]`.
    3. Importiere `FormField` in der Komponente.
  checks:
    input-updates-model: Eingaben in Name und Stadt erscheinen in der Vorschau
    checkbox-updates-model: "Die Checkbox schaltet „newsletter: yes“"
    model-updates-inputs: "**Fill example** füllt die Felder aus"
---

# Signal Forms

Fast jede Anwendung braucht Formulare: Anmeldung, Suche, Einstellungen. Angular hat dafür seit Version 21 **Signal Forms**. Du beschreibst deine Daten als Signal, und Angular baut daraus ein Formular, das mit diesem Signal immer synchron bleibt.

> [!NOTE]
> Signal Forms sind seit Angular 22 stabil. Die Live-Beispiele laufen auf Angular 21, wo sie noch als *experimental* gelten. Die API ist dieselbe.

## Das Model

Am Anfang steht ein ganz normales Signal mit den Formulardaten:

```ts
interface Signup {
  name: string;
  email: string;
  weekly: boolean;
}

protected readonly model = signal<Signup>({ name: '', email: '', weekly: false });
```

Aus diesem Signal macht `form()` einen **Feldbaum**, mit genau denselben Feldern wie das Model:

```ts
import { form, FormField } from '@angular/forms/signals';

protected readonly signupForm = form(this.model);
```

`signupForm.name`, `signupForm.email` und `signupForm.weekly` sind jetzt Felder, die du ans Template binden kannst. TypeScript kennt sie, ein Tippfehler wie `signupForm.nmae` fällt also sofort auf.

## Felder binden

Die Direktive `FormField` verbindet ein Eingabeelement mit einem Feld:

```html
<input [formField]="signupForm.name" />
<input type="email" [formField]="signupForm.email" />
<input type="checkbox" [formField]="signupForm.weekly" />
```

Das funktioniert in **beide Richtungen**:

- Tippt der Nutzer, schreibt Angular den Wert ins Model.
- Änderst du das Model im Code, etwa mit `model.set(...)`, zeigen die Felder sofort die neuen Werte.

Text, Zahlen, Checkboxen, `<select>` und `<textarea>` funktionieren ohne weitere Einstellungen. Bei `type="number"` landet eine Zahl im Model, kein String.

::tryit{forms-signal}

## Den Zustand eines Felds lesen

Rufst du ein Feld wie eine Funktion auf, bekommst du seinen **Zustand**. Jede Eigenschaft darin ist wieder ein Signal:

| Signal | Bedeutung |
|---|---|
| `value()` | der aktuelle Wert |
| `touched()` | der Nutzer hat das Feld verlassen |
| `dirty()` | der Nutzer hat den Wert geändert |
| `valid()` / `invalid()` | die Validierung ist (nicht) erfolgreich |
| `errors()` | die Liste der Fehler |

```html
@if (signupForm.email().dirty()) {
  <small>Du hast die E-Mail-Adresse geändert.</small>
}
```

Auch das ganze Formular hat einen Zustand: `signupForm().valid()` ist nur dann `true`, wenn alle Felder gültig sind.

## Absenden

`submit()` führt deine Aktion aus, aber nur, wenn das Formular gültig ist. Vorher markiert es alle bearbeitbaren Felder als `touched`, damit Fehlermeldungen erscheinen:

```ts
protected onSubmit(event: Event): void {
  event.preventDefault(); // kein Neuladen der Seite
  void submit(this.signupForm, async () => {
    await this.api.save(this.model());
    return undefined; // keine Fehler vom Server
  });
}
```

```html
<form (submit)="onSubmit($event)">…</form>
```

> [!TIP]
> Die Daten musst du nicht erst aus dem Formular auslesen. Sie stehen schon im Model-Signal. `this.model()` ist immer der aktuelle Stand.

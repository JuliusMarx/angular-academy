---
title: Asynchrone Daten mit resource()
minutes: 9
quiz:
  - question: Was passiert, wenn sich ein Signal ändert, das in params gelesen wird?
    options:
      - Nichts, man muss reload() aufrufen
      - Die Resource lädt automatisch neu und bricht eine laufende Anfrage ab
      - Es wird ein Fehler geworfen
      - Die Seite wird neu geladen
    answer: 1
  - question: Welche Eigenschaft prüft, ob gerade geladen wird?
    options: ["value()", "isLoading()", "pending()", "loading"]
    answer: 1
  - question: Wofür ist der abortSignal-Parameter im loader?
    options:
      - Um die App zu beenden
      - Um eine veraltete Anfrage abzubrechen, wenn neue params kommen
      - Um Fehler zu unterdrücken
      - Um das Ergebnis zu cachen
    answer: 1
exercise:
  example: ex-resource
  title: Einen Nutzer laden
  task: |-
    `fetchUser()` in `user-api.ts` simuliert eine langsame Server-Anfrage.

    1. Lege eine `resource()` an, die mit `fetchUser()` den Nutzer zu `userId()` lädt – auch wenn sich die ID ändert.
    2. Zeige während des Ladens `<p id="loading">Loading …</p>`, bei einem Fehler `<p id="error">` mit der Fehlermeldung und sonst `<h2 id="name">` mit dem Namen.
  checks:
    shows-loading: Während des Ladens ist `<p id="loading">` zu sehen
    shows-user: Der Name des gewählten Nutzers erscheint in `<h2 id="name">`
    shows-error: Für **User 99** erscheint die Fehlermeldung in `<p id="error">`
---

# Asynchrone Daten mit resource()

Signals sind synchron. Daten von einem Server kommen aber asynchron – sie brauchen Zeit, können fehlschlagen und sind manchmal schon veraltet, bevor sie ankommen. `resource()` verbindet beides: Es lädt Daten asynchron und stellt das Ergebnis als Signals bereit.

## Aufbau

```ts
import { Component, resource, signal } from '@angular/core';

@Component({ /* … */ })
export class UserProfile {
  protected readonly userId = signal(1);

  protected readonly user = resource({
    params: () => ({ id: this.userId() }),
    loader: ({ params, abortSignal }) =>
      fetch(`/api/users/${params.id}`, { signal: abortSignal }).then((r) => r.json()),
  });
}
```

- **`params`** ist eine reaktive Funktion. Ändert sich ein Signal darin, lädt die Resource automatisch neu.
- **`loader`** ist eine `async`-Funktion, die die Daten holt. Sie bekommt die aktuellen `params` und ein `abortSignal`.
- Kommen neue `params`, während noch geladen wird, wird die alte Anfrage über das `abortSignal` abgebrochen.

## Den Zustand anzeigen

Eine Resource stellt mehrere Signals bereit:

| Signal | Bedeutung |
|---|---|
| `value()` | die geladenen Daten (vorher `undefined`) |
| `hasValue()` | `true`, wenn Daten vorhanden sind |
| `isLoading()` | `true`, während geladen wird |
| `error()` | der Fehler, falls das Laden fehlgeschlagen ist |
| `status()` | `'idle'`, `'loading'`, `'reloading'`, `'resolved'`, `'error'` oder `'local'` |

```html
@if (user.isLoading()) {
  <p>Lädt …</p>
} @else if (user.error()) {
  <p>Fehler: {{ user.error()?.message }}</p>
} @else if (user.hasValue()) {
  <h2>{{ user.value().name }}</h2>
}
```

Mit `user.reload()` lädst du die Daten erneut, mit `user.set(…)` überschreibst du den Wert lokal (Status `'local'`).

::tryit{resource-loader}

> [!NOTE]
> Für HTTP-Anfragen gibt es mit `httpResource()` eine spezielle Variante, die auf dem `HttpClient` aufbaut. Sie lernst du im Kapitel *HTTP* kennen.

> [!TIP]
> Gibt `params` `undefined` zurück, lädt die Resource nicht und bleibt im Status `'idle'`. So lädst du zum Beispiel erst, wenn ein Nutzer ausgewählt wurde.

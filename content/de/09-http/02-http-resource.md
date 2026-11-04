---
title: httpResource
minutes: 7
summary: |-
  - `httpResource()` ist `resource()` zugeschnitten auf `HttpClient`: Du gibst nur eine Funktion an, die die URL liefert. Stabil seit Angular 22.
  - Liest die Funktion ein Signal, lädt Angular bei jeder Änderung neu und bricht ältere, noch laufende Anfragen ab.
  - Wie `HttpClient` braucht sie kein Setup. Interceptors aus `provideHttpClient(withInterceptors(…))` gelten auch hier.
  - Zustand: `value()`, `hasValue()` (grenzt den Typ ein), `isLoading()`, `error()`. Mit `reload()` lädst du von Hand neu.
  - Die Funktion kann ein Objekt mit `url`, `params` usw. zurückgeben. Bei `undefined` wird gar nicht geladen.
  - Zum Lesen nimmst du `httpResource`, zum Ändern (POST, PUT, DELETE) und für Klick-Aktionen weiterhin `HttpClient`.

  ```ts
  protected readonly id = signal(1);
  protected readonly product = httpResource<Product>(() => `/api/products/${this.id()}.json`);
  ```

  ```html
  @if (product.isLoading()) {
    <p>Lädt …</p>
  } @else if (product.hasValue()) {
    <h2>{{ product.value().name }}</h2>
  }
  ```
quiz:
  - question: "Wann lädt `httpResource(() => '/api/users/' + this.id())` neu?"
    options:
      - Nur beim Start
      - Jedes Mal, wenn sich `id()` ändert
      - Alle paar Sekunden
      - Nur nach `reload()`
    answer: 1
    explanation: "Die Funktion liest ein Signal. Ändert es sich, baut Angular die URL neu und sendet eine neue Anfrage. Mit `reload()` kannst du zusätzlich von Hand neu laden."
  - question: "Was passiert, wenn die URL-Funktion `undefined` zurückgibt?"
    options:
      - Es wird `/undefined` geladen
      - Es wird keine Anfrage gesendet
      - Angular wirft einen Fehler
      - Der letzte Wert wird gelöscht und neu geladen
    answer: 1
  - question: Wofür nimmst du weiterhin `HttpClient` statt `httpResource`?
    options:
      - Für Listen
      - Für Daten, die sich mit einem Signal ändern
      - Für Änderungen wie POST, PUT und DELETE
      - Für JSON-Dateien
    answer: 2
exercise:
  example: ex-http-resource
  title: Nutzer per ID laden
  task: |-
    Die Buttons ändern die ID, geladen wird aber noch nichts.

    1. Lade den Nutzer mit `httpResource<User>()` von `/api/users/<id>.json`. Die URL hängt von `id()` ab.
    2. Zeige in `#user` je nach Zustand „Loading …“, den Fehlertext „User could not be loaded.“ oder Name und Stadt, z. B. „Ada Lovelace from London“.
  checks:
    shows-user: Nutzer 1 wird angezeigt
    follows-id: Nach **Next** erscheint Nutzer 2
    shows-error: Für den fehlenden Nutzer 3 erscheint die Fehlermeldung
---

# httpResource

Im Kapitel *Signals* hast du `resource()` kennengelernt: einen Wert, der asynchron geladen wird und bei Änderungen von Signals neu lädt. `httpResource()` ist genau das, zugeschnitten auf `HttpClient`. Statt einer Ladefunktion gibst du nur die URL an.

> [!NOTE]
> `httpResource` ist seit Angular 22 stabil. Die Live-Beispiele laufen auf Angular 21, wo es noch als *experimental* gilt. Die API ist dieselbe.

## Eine URL, die sich ändert

```ts
import { httpResource } from '@angular/common/http';

protected readonly id = signal(1);
protected readonly product = httpResource<Product>(() => `/api/products/${this.id()}.json`);
```

Die Funktion liest `id()`. Ändert sich die ID, sendet Angular automatisch eine neue Anfrage. Ist eine ältere Anfrage noch unterwegs, wird sie abgebrochen, damit keine veraltete Antwort die neue überschreibt.

`httpResource` nutzt intern `HttpClient` und braucht wie dieser kein Setup. Interceptors, die du mit `provideHttpClient(withInterceptors(…))` registrierst, gelten deshalb auch hier.

## Den Zustand anzeigen

Die Resource hat dieselben Signals wie `resource()`:

| Signal | Bedeutung |
|---|---|
| `value()` | die Antwort (vor der ersten Antwort `undefined`) |
| `hasValue()` | `true`, sobald ein Wert da ist |
| `isLoading()` | eine Anfrage läuft |
| `error()` | der Fehler der letzten Anfrage, sonst `undefined` |

```html
@if (product.isLoading()) {
  <p>Lädt …</p>
} @else if (product.error()) {
  <p>Das Produkt konnte nicht geladen werden.</p>
} @else if (product.hasValue()) {
  <h2>{{ product.value().name }}</h2>
}
```

`hasValue()` grenzt den Typ ein: Im `@if`-Block weiß TypeScript, dass `value()` nicht `undefined` ist.

::tryit{http-resource}

Probiere im Beispiel **Next** bis Produkt 4: Diese Datei gibt es nicht, der Server antwortet mit 404 und `error()` ist gesetzt.

## Mehr als eine URL

Statt eines Strings kann die Funktion ein Objekt zurückgeben, mit Parametern, Headern oder einer anderen Methode:

```ts
protected readonly results = httpResource<Product[]>(() => ({
  url: '/api/products',
  params: { q: this.query(), page: this.page() },
}));
```

Gibt die Funktion `undefined` zurück, wird **gar nicht** geladen. So wartest du, bis alle Angaben da sind:

```ts
protected readonly user = httpResource<User>(() => {
  const id = this.selectedId();
  return id === null ? undefined : `/api/users/${id}`;
});
```

Mit `reload()` lädst du von Hand neu, etwa über einen „Aktualisieren“-Button.

## httpResource oder HttpClient?

- **Lesen** von Daten, die von Signals abhängen: `httpResource`. Du schreibst weniger Code und bekommst Ladezustand und Fehler gratis.
- **Ändern** von Daten (POST, PUT, DELETE) oder Anfragen, die ein Klick auslöst: `HttpClient`. Eine Resource lädt immer dann, wenn sich ihre Signals ändern. Das passt nicht zu „genau einmal speichern“.

> [!TIP]
> Nach dem Speichern mit `HttpClient` rufst du `reload()` auf der Resource auf, damit die Anzeige den neuen Stand zeigt.

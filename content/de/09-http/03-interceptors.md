---
title: Interceptors und Fehlerbehandlung
minutes: 9
summary: |-
  - Ein Interceptor (`HttpInterceptorFn`) ist eine Funktion, die jede Anfrage `req` sieht und sie mit `next(req)` weiterreicht.
  - Anfragen sind unveränderlich: `req.clone({ setHeaders: … })` erzeugt eine geänderte Kopie. `inject()` funktioniert im Interceptor.
  - Registriert wird mit `provideHttpClient(withInterceptors([…]))`. Die Anfrage läuft von links nach rechts, die Antwort zurück.
  - Bei Fehlern bekommst du einen `HttpErrorResponse`: `status` `0` heißt keine Antwort, `4xx` Fehler der Anfrage, `5xx` Fehler auf dem Server.
  - `catchError` fängt Fehler ab, `retry` lohnt sich bei `0` und `5xx`. Ein Fehler-Interceptor gibt den Fehler mit `throwError` weiter.
  - Bei `httpResource` brauchst du kein `catchError`, der Fehler landet in `error()`.

  ```ts
  export const authInterceptor: HttpInterceptorFn = (req, next) => {
    if (!req.url.startsWith('/api/')) return next(req);
    return next(req.clone({ setHeaders: { Authorization: `Bearer ${inject(Auth).token()}` } }));
  };
  ```

  > [!WARNING] Hängst du den Token an jede Anfrage, bekommen ihn auch fremde Server. Schick ihn nur an die eigene API.
quiz:
  - question: Warum ruft ein Interceptor `req.clone(...)` auf, statt `req` direkt zu ändern?
    options:
      - Weil `clone()` schneller ist
      - Weil Anfragen unveränderlich sind
      - Damit die Anfrage zweimal gesendet wird
      - Weil `req` nur im Test existiert
    answer: 1
  - question: "Ein Interceptor hängt den Token an jede Anfrage. Was ist das Problem?"
    options:
      - Es gibt keins
      - Der Token geht auch an fremde Server
      - Die Anfragen werden langsamer
      - Angular lehnt solche Anfragen ab
    answer: 1
  - question: "Ein `HttpErrorResponse` hat den Status `0`. Was bedeutet das meistens?"
    options:
      - Alles hat geklappt
      - Der Server hat mit einem Fehler geantwortet
      - Es kam gar keine Antwort, z. B. weil das Netzwerk fehlt oder CORS blockiert
      - Die Datei war leer
    answer: 2
exercise:
  example: ex-interceptor
  title: Token und Fehlermeldungen
  task: |-
    Das Profil lässt sich nicht laden (401), und Fehler bleiben unbemerkt.

    1. Schreibe in `interceptors.ts` den `authInterceptor`: Er hängt `Authorization: Bearer demo-token` an alle Anfragen an `/api/`, aber **nicht** an fremde Server.
    2. Schreibe den `errorInterceptor`: Bei einem Fehler zeigt er „Request failed: <Status>“ im `ErrorBanner` an und gibt den Fehler weiter.
    3. Registriere beide in `app.config.ts`, vor `fakeBackendInterceptor`. Der spielt den Server und muss als letzter in der Liste stehen.
  checks:
    adds-token: "**Load profile** zeigt „Signed in as Ada Lovelace“"
    token-only-for-api: Der fremde Analytics-Server bekommt keinen Token
    error-banner: "Eine fehlende Datei zeigt „Request failed: 404“ im Banner"
---

# Interceptors und Fehlerbehandlung

Manche Dinge gelten für **jede** Anfrage: einen Login-Token mitschicken, Fehler melden, Anfragen protokollieren. Statt das in jedem Service zu wiederholen, schreibst du einen **Interceptor**. Er sitzt zwischen deinem Code und dem Netzwerk und sieht jede Anfrage und jede Antwort.

## Ein Interceptor

Ein Interceptor ist eine Funktion. Sie bekommt die Anfrage `req` und `next`, das nächste Glied der Kette. Mit `next(req)` reicht sie die Anfrage weiter:

```ts
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith('/api/')) return next(req);
  return next(req.clone({ setHeaders: { Authorization: `Bearer ${inject(Auth).token()}` } }));
};
```

- Anfragen sind **unveränderlich**. `clone()` erzeugt eine geänderte Kopie.
- Der Token geht nur an die eigene API. Hängst du ihn an jede Anfrage, bekommen ihn auch fremde Server, etwa für Analytics oder Karten.
- `inject()` funktioniert, weil Angular Interceptors in einem Injection Context aufruft.

Registriert werden Interceptors bei `provideHttpClient()`:

```ts
provideHttpClient(withInterceptors([loggingInterceptor, authInterceptor]));
```

Die **Reihenfolge** zählt: Die Anfrage läuft von links nach rechts durch die Liste, die Antwort in umgekehrter Richtung zurück.

## Auf die Antwort reagieren

`next(req)` gibt ein Observable der Antwort zurück. Mit RxJS-Operatoren kannst du darauf reagieren, zum Beispiel die Dauer messen:

```ts
export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const started = Date.now();
  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) console.log(req.url, event.status, `${Date.now() - started} ms`);
    }),
  );
};
```

::tryit{http-interceptors}

Das Beispiel enthält einen `fakeBackendInterceptor`. Er beantwortet `/api/me` selbst, statt die Anfrage weiterzugeben, so wie ein echter Server mit Login-Prüfung. Solche Interceptors sind auch praktisch, um ohne Backend zu entwickeln.

## Fehler behandeln

Schlägt eine Anfrage fehl, bekommst du einen `HttpErrorResponse`. Sein `status` verrät, was los ist:

| Status | Bedeutung |
|---|---|
| `0` | keine Antwort: kein Netz, Server nicht erreichbar oder von CORS blockiert |
| `400`–`499` | Fehler der Anfrage, z. B. `401` nicht angemeldet, `404` nicht gefunden |
| `500`–`599` | Fehler auf dem Server |

Mit `catchError` fängst du den Fehler ab, mit `retry` versuchst du es vorher noch einmal:

```ts
this.http.get<News[]>('/api/news').pipe(
  retry(2),
  catchError((err: HttpErrorResponse) => {
    this.error.set(err.status === 404 ? 'Nicht gefunden.' : 'Laden fehlgeschlagen.');
    return EMPTY; // nichts weitergeben, der Fehler ist erledigt
  }),
);
```

> [!TIP]
> `retry` lohnt sich bei Status `0` und `5xx`: Das Netz oder der Server haben vielleicht nur kurz gehakt. Bei `4xx` liefert ein zweiter Versuch dieselbe Antwort.

Für Meldungen, die überall gleich aussehen sollen, bietet sich ein Fehler-Interceptor an. Er zeigt die Meldung an und gibt den Fehler mit `throwError` weiter, damit der aufrufende Code trotzdem reagieren kann:

```ts
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const banner = inject(ErrorBanner);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      banner.show(`Anfrage fehlgeschlagen: ${error.status}`);
      return throwError(() => error);
    }),
  );
};
```

Bei `httpResource` brauchst du kein `catchError`. Der Fehler landet in `error()`, und du zeigst ihn im Template an.

> [!WARNING]
> Ein Fehler, den niemand behandelt, erscheint nur in der Konsole. Der Nutzer sieht dann einfach nichts. Überlege bei jeder Anfrage, was er im Fehlerfall sehen soll.

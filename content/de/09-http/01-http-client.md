---
title: HttpClient
minutes: 8
summary: |-
  - Seit Angular 21 kannst du `HttpClient` ohne Setup injizieren. `provideHttpClient()` brauchst du nur noch zum Konfigurieren, etwa mit `withInterceptors()`.
  - Anfragen gehören in einen Service. `get<Product[]>()` sagt TypeScript nur den Typ – geprüft wird die Antwort nicht.
  - Das Ergebnis ist ein kaltes Observable: Die Anfrage geht erst beim Abonnieren los. HTTP-Observables beenden sich danach selbst.
  - `toSignal()` abonniert für dich und macht ein Signal daraus (bis zur Antwort `initialValue`, sonst `undefined`). Für Aktionen wie Klicks nimmst du `subscribe()`.
  - Zum Ändern gibt es `post`, `put`, `patch` und `delete`. Query-Parameter und Header übergibst du als Optionen (`params`, `headers`).

  ```ts
  export class ProductService {
    private readonly http = inject(HttpClient);
    getAll(): Observable<Product[]> {
      return this.http.get<Product[]>('/api/products.json');
    }
  }

  protected readonly products = toSignal(this.productService.getAll(), { initialValue: [] });
  ```

  > [!WARNING] Auch `post()` und `delete()` senden erst beim `subscribe()`. Ein vergessenes `subscribe()` ist ein häufiger Grund, warum „nichts passiert“.
quiz:
  - question: Wofür brauchst du `provideHttpClient()` in aktuellen Angular-Versionen?
    options:
      - Ohne den Aufruf lässt sich `HttpClient` nicht injizieren
      - Um `HttpClient` zu konfigurieren, zum Beispiel mit Interceptors
      - Um `HttpClientModule` in jede Komponente zu importieren
      - Um das npm-Paket zu installieren
    answer: 1
    explanation: "Seit Angular 21 ist `HttpClient` ohne Setup injizierbar. `provideHttpClient()` brauchst du nur noch, wenn du ihn anpassen willst."
  - question: "Wann sendet `this.http.get('/api/todos')` die Anfrage ab?"
    options:
      - Sofort beim Aufruf von `get()`
      - Erst, wenn jemand das Observable abonniert
      - Beim nächsten Rendern
      - Wenn die Komponente zerstört wird
    answer: 1
    explanation: "Observables von HttpClient sind *kalt*: Ohne `subscribe()` (oder `toSignal()`, das intern abonniert) passiert gar nichts."
  - question: "Was bewirkt `get<Todo[]>(...)`?"
    options:
      - Angular prüft die Antwort zur Laufzeit gegen den Typ
      - TypeScript behandelt die Antwort als `Todo[]`, geprüft wird sie nicht
      - Die Antwort wird in Todo-Objekte umgewandelt
      - Der Server bekommt den Typ mitgeteilt
    answer: 1
exercise:
  example: ex-http-client
  title: Todos vom Server laden
  task: |-
    Die Todo-Liste ist leer. Lade sie von `/api/todos.json`.

    1. Injiziere im `TodoService` den `HttpClient` und lade die Liste mit `get<Todo[]>()`.
    2. Mach in der Komponente mit `toSignal()` ein Signal aus dem Observable (mit `initialValue: []`).
  checks:
    loads-todos: Die Liste zeigt drei Todos
    shows-titles: Der erste Eintrag ist „Buy milk“
    open-count: Die Anzeige zählt „2 open“
---

# HttpClient

Bisher kamen alle Daten direkt aus dem Code. In echten Anwendungen liegen sie auf einem Server. Für die Kommunikation mit ihm bringt Angular den **HttpClient** mit. Er sendet Anfragen, wandelt JSON automatisch um und lässt sich mit Interceptors erweitern (mehr dazu in der übernächsten Lektion).

> [!NOTE]
> Die Live-Beispiele laden ihre Daten aus JSON-Dateien im Ordner `public/api/`. Der Dev-Server liefert sie aus wie eine echte API. Im Editor kannst du die Dateien öffnen und ändern.

## Einrichten

Nichts zu tun: Seit Angular 21 kannst du `HttpClient` ohne Setup überall injizieren. Erst wenn du ihn anpassen willst, etwa mit Interceptors, rufst du in der App-Konfiguration `provideHttpClient()` auf:

```ts
import { provideHttpClient, withInterceptors } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(withInterceptors([authInterceptor]))],
};
```

Ältere Projekte und Anleitungen tragen `provideHttpClient()` immer ein. Das schadet nicht, ist aber nicht mehr nötig.

> [!NOTE]
> Seit Angular 22 schickt `HttpClient` die Anfragen über die `fetch`-API des Browsers. In Angular 21, auf dem die Live-Beispiele laufen, ist noch `XMLHttpRequest` Standard. Dort schaltet `provideHttpClient(withFetch())` auf `fetch` um. In Angular 22 ist `withFetch()` überflüssig und veraltet.

## Daten laden

Anfragen gehören in einen Service, nicht in die Komponente. So kann jede Komponente sie wiederverwenden, und im Test ersetzt du nur den Service:

```ts
@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>('/api/products.json');
  }
}
```

- `get<Product[]>` sagt TypeScript, welche Form die Antwort hat. **Geprüft** wird das nicht: Schickt der Server etwas anderes, merkst du es erst zur Laufzeit.
- Das Ergebnis ist ein **Observable**, ein Strom von Werten aus der Bibliothek RxJS. Bei HTTP kommt genau ein Wert, die Antwort.

## Die Antwort verwenden

Ein Observable von `HttpClient` ist **kalt**: Die Anfrage geht erst los, wenn jemand es abonniert. Dafür gibt es zwei Wege.

**`toSignal()`** abonniert für dich und macht aus der Antwort ein Signal. Das ist der bequemste Weg, wenn die Daten beim Start geladen werden sollen:

```ts
import { toSignal } from '@angular/core/rxjs-interop';

protected readonly products = toSignal(this.productService.getAll(), { initialValue: [] });
```

Bis die Antwort da ist, hat das Signal den `initialValue`. Ohne ihn ist es `undefined`, praktisch für eine „Lädt …“-Anzeige.

**`subscribe()`** brauchst du, wenn die Anfrage erst bei einer Aktion losgehen soll, etwa bei einem Klick:

```ts
protected countInStock(): void {
  this.productService.getAll().subscribe((list) => {
    this.inStock.set(list.filter((p) => p.stock > 0).length);
  });
}
```

::tryit{http-client}

> [!TIP]
> HTTP-Observables beenden sich nach der Antwort selbst. Abmelden mit `unsubscribe()` musst du dich bei ihnen nicht.

## Daten senden

Für Änderungen gibt es `post`, `put`, `patch` und `delete`. Bei `post`, `put` und `patch` ist der zweite Parameter der Body, `HttpClient` wandelt ihn in JSON um. `delete` hat keinen Body, nur die URL:

```ts
create(product: NewProduct): Observable<Product> {
  return this.http.post<Product>('/api/products', product);
}

remove(id: number): Observable<void> {
  return this.http.delete<void>(`/api/products/${id}`);
}
```

Query-Parameter und Header übergibst du als Optionen:

```ts
this.http.get<Product[]>('/api/products', {
  params: { sort: 'price', limit: 10 },  // → /api/products?sort=price&limit=10
  headers: { 'Accept-Language': 'de' },
});
```

> [!WARNING]
> Auch `post()` und `delete()` senden erst beim `subscribe()`. Ein vergessenes `subscribe()` ist ein häufiger Grund, warum „nichts passiert“.

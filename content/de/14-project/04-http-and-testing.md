---
title: Server anbinden und testen
minutes: 11
summary: |-
  - Nur der Store ändert sich: Er lädt die Aufgaben mit `httpResource` von `/api/tasks.json` und schreibt mit `HttpClient` per `POST` und `PUT`. Die Komponenten bleiben fast gleich.
  - In einem Fehlerzustand wirft `value()`. Der Store gibt deshalb `computed(() => resource.hasValue() ? resource.value() : [])` heraus, dazu `isLoading` und `error`.
  - Nach einem erfolgreichen Schreiben aktualisiert `resource.update(…)` die Liste lokal mit der Antwort des Servers – ohne alles neu zu laden.
  - `add()` wird `async`: `await firstValueFrom(http.post(…))`. Das Formular zeigt währenddessen `submitting()` an und fängt Fehler ab.
  - Ein Fake-Backend-Interceptor beantwortet `POST` und `PUT`, die ein statischer Server nicht kann. `GET` reicht er an den Dev-Server weiter.
  - Tests: `provideHttpClientTesting()` fängt alle Anfragen ab. `TestBed.tick()` startet die Anfrage von `httpResource`, `flush()` liefert die Antwort, `whenStable()` wartet, bis sie angekommen ist.

  ```ts
  private readonly resource = httpResource<Task[]>(() => '/api/tasks.json', { defaultValue: [] });
  readonly tasks = computed(() => (this.resource.hasValue() ? this.resource.value() : []));

  async add(draft: TaskDraft): Promise<Task> {
    const task = await firstValueFrom(this.http.post<Task>('/api/tasks', { ...draft, done: false }));
    this.resource.update((tasks) => [...tasks, task]);
    return task;
  }
  ```
quiz:
  - question: "Warum gibt der Store nicht einfach `resource.value` heraus?"
    options:
      - Weil `value()` im Fehlerzustand eine Exception wirft – jede Komponente, die es liest, würde abstürzen
      - Weil `value` kein Signal ist
      - Weil `httpResource` keine Arrays laden kann
      - Weil Komponenten keine Resources lesen dürfen
    answer: 0
    explanation: "`hasValue()` ist im Fehlerzustand `false`. Der Store gibt dann eine leere Liste heraus, und die Liste zeigt die Meldung aus `error()`."
  - question: "Der Store lädt mit `httpResource`. Wofür braucht er zusätzlich `HttpClient`?"
    options:
      - Für nichts, `httpResource` kann auch POST senden
      - Für Schreibzugriffe wie `POST` und `PUT`, die auf einen Klick hin passieren – `httpResource` ist zum Lesen gedacht
      - Weil `httpResource` ohne `HttpClient` keine Interceptors nutzt
      - Nur für Tests
    answer: 1
  - question: "Nach dem `POST` ruft der Store `resource.update((tasks) => [...tasks, task])` auf. Warum nicht `resource.reload()`?"
    options:
      - "`reload()` gibt es nicht"
      - "`update()` ist asynchron"
      - "Die Antwort des Servers enthält die neue Aufgabe schon. `update()` spart eine Anfrage – und hier würde `reload()` sie sogar verlieren, weil `tasks.json` sich nicht ändert"
      - "`reload()` würde die Seite neu laden"
    answer: 2
  - question: "Im Test findet `http.expectOne('/api/tasks.json')` keine Anfrage, obwohl der Store erzeugt wurde. Was fehlt?"
    options:
      - "`provideHttpClient()` muss nach `provideHttpClientTesting()` stehen"
      - Der Store muss mit `new` erzeugt werden
      - "`http.verify()` vor `expectOne()`"
      - "`TestBed.tick()` – `httpResource` sendet seine Anfrage aus einem Effect, und der läuft erst dann"
    answer: 3
---

# Server anbinden und testen

Die App kann alles, was sie soll – nur vergisst sie neue Aufgaben beim Neuladen. Jetzt holt der Store die Aufgaben vom Server und schickt Änderungen dorthin. Danach sicherst du das Verhalten mit Tests ab.

## Der Store spricht HTTP

Die Aufgaben liegen jetzt in `public/api/tasks.json`. Der Dev-Server liefert die Datei unter `/api/tasks.json` aus wie eine echte API. Gelesen wird mit `httpResource`, geschrieben mit `HttpClient`:

```ts
@Injectable({ providedIn: 'root' })
export class TaskStore {
  private readonly http = inject(HttpClient);

  private readonly resource = httpResource<Task[]>(() => '/api/tasks.json', { defaultValue: [] });

  readonly tasks = computed(() => (this.resource.hasValue() ? this.resource.value() : []));
  readonly openCount = computed(() => this.tasks().filter((t) => !t.done).length);
  readonly isLoading = this.resource.isLoading;
  readonly error = this.resource.error;

  async add(draft: TaskDraft): Promise<Task> {
    const task = await firstValueFrom(this.http.post<Task>('/api/tasks', { ...draft, done: false }));
    this.resource.update((tasks) => [...tasks, task]);
    return task;
  }

  toggle(id: number): void {
    const task = this.tasks().find((t) => t.id === id);
    if (!task) return;
    this.http.put<Task>(`/api/tasks/${id}`, { ...task, done: !task.done }).subscribe((saved) => {
      this.resource.update((tasks) => tasks.map((t) => (t.id === saved.id ? saved : t)));
    });
  }
}
```

- **Gleiche Schnittstelle.** `tasks`, `openCount`, `add()` und `toggle()` gibt es weiterhin. Liste, Detailseite und Kopf müssen deshalb kaum angepasst werden. Das zahlt sich jetzt aus: Die Komponenten wissen nicht, woher die Daten kommen.
- **Fehler abfangen.** Im Fehlerzustand wirft `value()` eine Exception. `hasValue()` ist dann `false`, und `tasks` bleibt eine leere Liste.
- **Lokal aktualisieren.** Eine Resource ist beschreibbar: `update()` setzt ihren Wert, ohne neu zu laden. Der Store übernimmt dafür die **Antwort des Servers**, denn erst der Server vergibt die id.
- **Erst speichern, dann anzeigen.** Die Liste ändert sich erst, wenn der Server geantwortet hat. Schlägt die Anfrage fehl, zeigt die App nichts Falsches an. Die Alternative, sofort anzeigen und bei einem Fehler zurückrollen, nennt man *optimistisches Update*.

`add()` ist jetzt `async`, weil das Formular auf die id warten muss. `firstValueFrom()` macht aus dem Observable ein Promise.

## Ladezustand und Fehler

Die Liste zeigt jetzt, ob noch geladen wird oder etwas schiefging:

```html
@if (store.error()) {
  <p role="alert">The tasks could not be loaded.</p>
} @else if (store.isLoading()) {
  <p>Loading …</p>
} @else {
  <ul class="tasks"> … </ul>
}
```

Auch die Detailseite braucht einen Ladezustand. Öffnet jemand `/tasks/3` direkt, ist die Liste noch unterwegs – ohne `@else if (store.isLoading())` stünde kurz „Task not found“ da.

Das Formular wartet auf den Server. `submitting()` ist `true`, solange die Aktion von `submit()` läuft:

```html
<button type="submit" [disabled]="taskForm().submitting()">
  {{ taskForm().submitting() ? 'Saving …' : 'Save task' }}
</button>
<p role="alert">{{ saveError() }}</p>
```

```ts
void submit(this.taskForm, async () => {
  this.saveError.set('');
  try {
    const task = await this.store.add(this.model());
    await this.router.navigate(['/tasks', task.id]);
  } catch {
    this.saveError.set('The task could not be saved. Please try again.');
  }
  return undefined;
});
```

## Ein Fake-Backend für POST und PUT

Ein statischer Server kann Dateien ausliefern, aber nichts speichern. Wie im Kapitel HTTP übernimmt ein Interceptor die Rolle des Servers:

```ts
let nextId = 100;

export const fakeBackendInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.method === 'POST' && req.url === '/api/tasks') {
    const task = { ...(req.body as Omit<Task, 'id'>), id: nextId++ };
    return of(new HttpResponse({ status: 201, body: task })).pipe(delay(400));
  }
  if (req.method === 'PUT' && /^\/api\/tasks\/\d+$/.test(req.url)) {
    return of(new HttpResponse({ status: 200, body: req.body })).pipe(delay(400));
  }
  return next(req); // GET goes to the dev server, which serves public/
};
```

Registriert wird er mit `provideHttpClient(withInterceptors([fakeBackendInterceptor]))`. Gibt es später ein echtes Backend, entfernst du ihn – Store und Komponenten bleiben, wie sie sind. Das `delay(400)` simuliert die Antwortzeit, damit du „Saving …“ siehst.

::tryit{project-http}

## Den Store testen

Zum Schluss sicherst du das Verhalten mit Tests ab. Der Store ist dafür der beste Kandidat: Hier steckt die Logik, und alle Seiten hängen von ihm ab. Im Test ersetzt `provideHttpClientTesting()` das Netzwerk, und du bestimmst, was der „Server“ antwortet:

```ts
beforeEach(() => {
  TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
  store = TestBed.inject(TaskStore);
  http = TestBed.inject(HttpTestingController);
});

afterEach(() => http.verify());

/** httpResource sends its request from an effect – TestBed.tick() runs it. */
async function respondWith(body: Task[] | string, status = 200): Promise<void> {
  TestBed.tick();
  http.expectOne('/api/tasks.json').flush(body, { status, statusText: status === 200 ? 'OK' : 'Not Found' });
  await TestBed.inject(ApplicationRef).whenStable();
}

it('creates a task with POST and adds the answer of the server', async () => {
  await respondWith(TASKS);
  const added = store.add({ title: 'Ship it', notes: '' });

  const req = http.expectOne('/api/tasks');
  expect(req.request.method).toBe('POST');
  req.flush({ id: 7, title: 'Ship it', notes: '', done: false });

  expect((await added).id).toBe(7);
  expect(store.openCount()).toBe(2);
});
```

Drei Schritte machen `httpResource` im Test greifbar:

1. `TestBed.tick()` – die Resource sendet ihre Anfrage aus einem Effect. Erst `tick()` lässt ihn laufen.
2. `flush()` – liefert die Antwort, die du im Test festlegst. Mit `{ status: 404 }` testest du den Fehlerfall.
3. `await …whenStable()` – wartet, bis die Antwort in der Resource angekommen ist.

Die Anfragen von `HttpClient` brauchen kein `tick()`: `add()` sendet den `POST` sofort, und `flush()` liefert die Antwort direkt. Der Fake-Backend-Interceptor ist im Test nicht registriert. Du testest den Store, nicht den gespielten Server.

Das Beispiel testet außerdem `TaskItem` mit `TestBed.createComponent()`: Verlinkt es richtig, hat die Checkbox einen Namen, meldet sie den Klick?

::tryit{project-test}

Baue einen Fehler in `task-store.ts` ein, etwa `done: true` im `POST`, und schau, welcher Test fehlschlägt.

## Wie es weitergeht

Die App ist fertig – und klein genug, dass du sie gut ausbauen kannst. Ein paar Ideen, jede mit dem Wissen aus einem früheren Kapitel:

- **Löschen** per `DELETE` und eine Rückfrage vorher (HTTP, Barrierefreiheit: Fokus im Dialog).
- **Bearbeiten** unter `/tasks/:id/edit` mit demselben Formular (Routing, Signal Forms).
- **Suche** in der Liste mit Query-Parameter `?q=…` (Routing, `computed()`).
- **Ein Guard**, der beim Verlassen des Formulars mit ungespeicherten Änderungen nachfragt (`canDeactivate`).
- **UI-Tests** mit Playwright für den ganzen Ablauf „Aufgabe anlegen, abhaken, wiederfinden“.

Am meisten lernst du aber mit einer eigenen Idee. Starte mit `ng new`, plane das Datenmodell und baue die App in denselben Schritten wie hier.

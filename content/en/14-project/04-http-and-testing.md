---
title: Connecting the server and testing
minutes: 11
summary: |-
  - Only the store changes: it loads the tasks with `httpResource` from `/api/tasks.json` and writes with `HttpClient` via `POST` and `PUT`. The components stay almost the same.
  - In the error state, `value()` throws. That's why the store exposes `computed(() => resource.hasValue() ? resource.value() : [])`, plus `isLoading` and `error`.
  - After a successful write, `resource.update(…)` updates the list locally with the server's answer – without reloading everything.
  - `add()` becomes `async`: `await firstValueFrom(http.post(…))`. Meanwhile the form shows `submitting()` and catches errors.
  - A fake-backend interceptor answers `POST` and `PUT`, which a static server can't do. It passes `GET` on to the dev server.
  - Tests: `provideHttpClientTesting()` catches all requests. `TestBed.tick()` starts the request of `httpResource`, `flush()` delivers the answer, `whenStable()` waits until it has arrived.

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
  - question: "Why doesn't the store simply expose `resource.value`?"
    options:
      - Because `value()` throws an exception in the error state – every component reading it would crash
      - Because `value` isn't a signal
      - Because `httpResource` can't load arrays
      - Because components must not read resources
    answer: 0
    explanation: "`hasValue()` is `false` in the error state. The store then hands out an empty list, and the list shows the message from `error()`."
  - question: "The store loads with `httpResource`. What does it need `HttpClient` for as well?"
    options:
      - For nothing, `httpResource` can send POST too
      - For writes like `POST` and `PUT` that happen in response to a click – `httpResource` is meant for reading
      - Because `httpResource` doesn't use interceptors without `HttpClient`
      - Only for tests
    answer: 1
  - question: "After the `POST`, the store calls `resource.update((tasks) => [...tasks, task])`. Why not `resource.reload()`?"
    options:
      - "`reload()` doesn't exist"
      - "`update()` is asynchronous"
      - "The server's answer already contains the new task. `update()` saves a request – and here `reload()` would even lose it, because `tasks.json` doesn't change"
      - "`reload()` would reload the page"
    answer: 2
  - question: "In the test, `http.expectOne('/api/tasks.json')` finds no request, although the store was created. What is missing?"
    options:
      - "`provideHttpClient()` has to come after `provideHttpClientTesting()`"
      - The store has to be created with `new`
      - "`http.verify()` before `expectOne()`"
      - "`TestBed.tick()` – `httpResource` sends its request from an effect, and that only runs then"
    answer: 3
---

# Connecting the server and testing

The app can do everything it should – except that it forgets new tasks on reload. Now the store fetches the tasks from the server and sends changes there. After that, you secure the behaviour with tests.

## The store speaks HTTP

The tasks now live in `public/api/tasks.json`. The dev server serves the file at `/api/tasks.json` like a real API. Reading uses `httpResource`, writing uses `HttpClient`:

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

- **Same interface.** `tasks`, `openCount`, `add()` and `toggle()` are still there. So the list, the detail page and the header hardly need changes. This is where it pays off: the components don't know where the data comes from.
- **Catching errors.** In the error state, `value()` throws an exception. `hasValue()` is then `false`, and `tasks` stays an empty list.
- **Updating locally.** A resource is writable: `update()` sets its value without reloading. The store uses the **server's answer** for that, because only the server assigns the id.
- **Save first, then show.** The list only changes once the server has answered. If the request fails, the app doesn't show anything wrong. The alternative – show it right away and roll back on an error – is called an *optimistic update*.

`add()` is now `async`, because the form has to wait for the id. `firstValueFrom()` turns the observable into a promise.

## Loading and errors

The list now shows whether it is still loading or something went wrong:

```html
@if (store.error()) {
  <p role="alert">The tasks could not be loaded.</p>
} @else if (store.isLoading()) {
  <p>Loading …</p>
} @else {
  <ul class="tasks"> … </ul>
}
```

The detail page needs a loading state too. If someone opens `/tasks/3` directly, the list is still on its way – without `@else if (store.isLoading())`, "Task not found" would flash up briefly.

The form waits for the server. `submitting()` is `true` while the action of `submit()` runs:

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

## A fake backend for POST and PUT

A static server can deliver files but can't store anything. Like in the HTTP chapter, an interceptor plays the server:

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

It is registered with `provideHttpClient(withInterceptors([fakeBackendInterceptor]))`. Once there is a real backend, you remove it – the store and the components stay as they are. The `delay(400)` simulates the response time, so you can see "Saving …".

::tryit{project-http}

## Testing the store

Finally, you secure the behaviour with tests. The store is the best candidate: the logic lives here, and every page depends on it. In the test, `provideHttpClientTesting()` replaces the network, and you decide what the "server" answers:

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

Three steps make `httpResource` testable:

1. `TestBed.tick()` – the resource sends its request from an effect. Only `tick()` lets it run.
2. `flush()` – delivers the answer you define in the test. With `{ status: 404 }` you test the error case.
3. `await …whenStable()` – waits until the answer has arrived in the resource.

Requests from `HttpClient` need no `tick()`: `add()` sends the `POST` right away, and `flush()` delivers the answer directly. The fake-backend interceptor isn't registered in the test. You test the store, not the pretend server.

The example also tests `TaskItem` with `TestBed.createComponent()`: does it link correctly, does the checkbox have a name, does it report the click?

::tryit{project-test}

Put a bug into `task-store.ts`, for example `done: true` in the `POST`, and see which test fails.

## Where to go from here

The app is done – and small enough to extend easily. A few ideas, each using what you learned in an earlier chapter:

- **Deleting** via `DELETE`, with a confirmation first (HTTP, accessibility: focus in the dialog).
- **Editing** at `/tasks/:id/edit` with the same form (routing, Signal Forms).
- **Searching** the list with a query parameter `?q=…` (routing, `computed()`).
- **A guard** that asks before leaving the form with unsaved changes (`canDeactivate`).
- **UI tests** with Playwright for the whole flow "create a task, tick it off, find it again".

But you learn the most with an idea of your own. Start with `ng new`, plan the data model and build the app in the same steps as here.

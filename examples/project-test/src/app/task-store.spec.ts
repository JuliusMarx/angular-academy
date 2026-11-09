import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Task } from './task';
import { TaskStore } from './task-store';

const TASKS: Task[] = [
  { id: 1, title: 'Plan the project', notes: '', done: true },
  { id: 2, title: 'Write a test', notes: '', done: false },
];

describe('TaskStore', () => {
  let store: TaskStore;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // No fakeBackendInterceptor here: HttpTestingController answers instead – the test decides what the server says.
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    store = TestBed.inject(TaskStore);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify(); // fails if a request was sent that the test didn't expect
  });

  /** httpResource sends its request from an effect – TestBed.tick() runs it. */
  async function respondWith(body: Task[] | string, status = 200): Promise<void> {
    TestBed.tick();
    http.expectOne('/api/tasks.json').flush(body, { status, statusText: status === 200 ? 'OK' : 'Not Found' });
    await TestBed.inject(ApplicationRef).whenStable(); // lets the resource take over the response
  }

  it('loads the tasks and counts the open ones', async () => {
    await respondWith(TASKS);
    expect(store.tasks()).toEqual(TASKS);
    expect(store.openCount()).toBe(1);
  });

  it('returns an empty list when loading fails', async () => {
    await respondWith('Not found', 404);
    expect(store.error()).toBeTruthy();
    expect(store.tasks()).toEqual([]);
  });

  it('creates a task with POST and adds the answer of the server', async () => {
    await respondWith(TASKS);
    const added = store.add({ title: 'Ship it', notes: '' });

    const req = http.expectOne('/api/tasks');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ title: 'Ship it', notes: '', done: false });
    req.flush({ id: 7, title: 'Ship it', notes: '', done: false });

    expect((await added).id).toBe(7);
    expect(store.tasks().map((t) => t.title)).toEqual(['Plan the project', 'Write a test', 'Ship it']);
    expect(store.openCount()).toBe(2);
  });

  it('ticks a task off with PUT', async () => {
    await respondWith(TASKS);
    store.toggle(2);

    const req = http.expectOne('/api/tasks/2');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ ...TASKS[1], done: true });
    req.flush({ ...TASKS[1], done: true });

    expect(store.openCount()).toBe(0);
  });
});

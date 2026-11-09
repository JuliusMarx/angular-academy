import { HttpClient, httpResource } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Task, TaskDraft } from './task';

/** Holds the tasks – now loaded from the server. The components didn't need to change. */
@Injectable({ providedIn: 'root' })
export class TaskStore {
  private readonly http = inject(HttpClient);

  /** GET /api/tasks.json – the file lives in public/api/tasks.json. */
  private readonly resource = httpResource<Task[]>(() => '/api/tasks.json', { defaultValue: [] });

  /** In the error state value() throws – so components get an empty list instead. */
  readonly tasks = computed(() => (this.resource.hasValue() ? this.resource.value() : []));
  readonly openCount = computed(() => this.tasks().filter((t) => !t.done).length);
  readonly isLoading = this.resource.isLoading;
  readonly error = this.resource.error;

  /** POST – the server assigns the id. Async, because the caller waits for that id. */
  async add(draft: TaskDraft): Promise<Task> {
    const task = await firstValueFrom(this.http.post<Task>('/api/tasks', { ...draft, done: false }));
    this.resource.update((tasks) => [...tasks, task]);
    return task;
  }

  /** PUT – replaces the task on the server, then updates the local list with its answer. */
  toggle(id: number): void {
    const task = this.tasks().find((t) => t.id === id);
    if (!task) return;
    this.http.put<Task>(`/api/tasks/${id}`, { ...task, done: !task.done }).subscribe((saved) => {
      this.resource.update((tasks) => tasks.map((t) => (t.id === saved.id ? saved : t)));
    });
  }
}

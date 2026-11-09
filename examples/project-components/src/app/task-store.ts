import { computed, Injectable, signal } from '@angular/core';
import { Task } from './task';

/** Holds the tasks – the single source of truth for every component. */
@Injectable({ providedIn: 'root' })
export class TaskStore {
  private readonly state = signal<Task[]>([
    { id: 1, title: 'Plan the project', notes: 'Pick the features for the first version.', done: true },
    { id: 2, title: 'Build the task list', notes: 'Components, signals and a store service.', done: false },
    { id: 3, title: 'Add a detail page', notes: 'One route per task.', done: false },
  ]);

  /** Read-only for components – changes go through the methods below. */
  readonly tasks = this.state.asReadonly();
  readonly openCount = computed(() => this.tasks().filter((t) => !t.done).length);

  toggle(id: number): void {
    // Never change the array or a task in place – create new objects, so signals notice the change.
    this.state.update((tasks) => tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }
}

import { Component, computed, inject, input, numberAttribute } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TaskStore } from './task-store';

/** The page /tasks/:id */
@Component({
  selector: 'app-task-detail',
  imports: [RouterLink],
  template: `
    @if (task(); as task) {
      <h1>{{ task.title }}</h1>
      <p>{{ task.notes || 'No notes.' }}</p>
      <p>Status: {{ task.done ? 'done' : 'open' }}</p>
      <button type="button" (click)="store.toggle(task.id)">
        {{ task.done ? 'Mark as open' : 'Mark as done' }}
      </button>
    } @else {
      <h1>Task not found</h1>
      <p>There is no task with the id {{ id() }}.</p>
    }
    <p><a routerLink="/tasks">Back to the list</a></p>
  `,
})
export class TaskDetail {
  protected readonly store = inject(TaskStore);

  /** The route parameter :id – a string in the URL, turned into a number. */
  readonly id = input.required({ transform: numberAttribute });

  /** Updates when the id changes and when the task changes in the store. */
  protected readonly task = computed(() => this.store.tasks().find((t) => t.id === this.id()));
}

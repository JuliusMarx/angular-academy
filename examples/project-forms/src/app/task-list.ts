import { Component, computed, inject, signal } from '@angular/core';
import { TaskItem } from './task-item';
import { TaskStore } from './task-store';

type Filter = 'all' | 'open' | 'done';

/** The page /tasks – the list from step 1, including the filter from the exercise. */
@Component({
  selector: 'app-task-list',
  imports: [TaskItem],
  template: `
    <h1>Tasks</h1>

    <div role="group" aria-label="Show">
      @for (f of filters; track f.value) {
        <button type="button" [attr.aria-pressed]="filter() === f.value" (click)="filter.set(f.value)">
          {{ f.label }}
        </button>
      }
    </div>

    <ul class="tasks">
      @for (task of visible(); track task.id) {
        <li><app-task-item [task]="task" (toggled)="store.toggle(task.id)" /></li>
      } @empty {
        <li>No tasks here.</li>
      }
    </ul>
  `,
  styles: `
    .tasks {
      padding: 0;
      list-style: none;
    }
    .tasks li {
      padding: 0.4rem 0;
    }
    [aria-pressed='true'] {
      font-weight: bold;
    }
  `,
})
export class TaskList {
  protected readonly store = inject(TaskStore);

  protected readonly filters: { value: Filter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'open', label: 'Open' },
    { value: 'done', label: 'Done' },
  ];

  protected readonly filter = signal<Filter>('all');

  protected readonly visible = computed(() => {
    const filter = this.filter();
    return this.store.tasks().filter((t) => filter === 'all' || t.done === (filter === 'done'));
  });
}

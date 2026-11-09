import { Component, computed, inject, signal } from '@angular/core';
import { TaskItem } from './task-item';
import { TaskStore } from './task-store';

type Filter = 'all' | 'open' | 'done';

@Component({
  selector: 'app-root',
  imports: [TaskItem],
  template: `
    <main>
      <h1>Tasks</h1>
      <p id="summary">{{ store.openCount() }} of {{ store.tasks().length }} open</p>

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
    </main>
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
export class App {
  protected readonly store = inject(TaskStore);

  protected readonly filters: { value: Filter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'open', label: 'Open' },
    { value: 'done', label: 'Done' },
  ];

  /** UI state that only this component needs – it stays here, not in the store. */
  protected readonly filter = signal<Filter>('all');

  /** Recomputed whenever the filter or the tasks change – e.g. after ticking a task off. */
  protected readonly visible = computed(() => {
    const filter = this.filter();
    return this.store.tasks().filter((t) => filter === 'all' || t.done === (filter === 'done'));
  });
}

import { Component, inject } from '@angular/core';
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
        <!-- TODO 2: one <button type="button"> per entry in filters, showing its label.
             A click sets the filter, aria-pressed shows whether it is the current one. -->
      </div>

      <ul class="tasks">
        <!-- TODO 3: loop over visible() instead of all tasks -->
        @for (task of store.tasks(); track task.id) {
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

  // TODO 1: a signal filter (start value 'all') and a computed visible
  // with the tasks of the store that match the filter
}

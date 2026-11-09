import { Component, inject } from '@angular/core';
import { TaskItem } from './task-item';
import { TaskStore } from './task-store';

@Component({
  selector: 'app-root',
  imports: [TaskItem],
  template: `
    <main>
      <h1>Tasks</h1>
      <p id="summary">{{ store.openCount() }} of {{ store.tasks().length }} open</p>

      <ul class="tasks">
        @for (task of store.tasks(); track task.id) {
          <li><app-task-item [task]="task" (toggled)="store.toggle(task.id)" /></li>
        } @empty {
          <li>No tasks yet.</li>
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
  `,
})
export class App {
  protected readonly store = inject(TaskStore);
}

import { Component, signal } from '@angular/core';

interface Task {
  id: number;
  title: string;
}

@Component({
  selector: 'app-root',
  template: `
    <h1>Tasks</h1>

    <ul id="tasks">
      @for (task of tasks(); track task.id) {
        <li>{{ task.title }}</li>
      } @empty {
        <li class="empty">No tasks</li>
      }
    </ul>

    <button type="button" (click)="add()">Add</button>
    <button type="button" (click)="tasks.set([])">Clear</button>
  `,
})
export class App {
  private nextId = 4;
  protected readonly tasks = signal<Task[]>([
    { id: 1, title: 'Learn @if' },
    { id: 2, title: 'Learn @for' },
    { id: 3, title: 'Learn @switch' },
  ]);

  protected add(): void {
    const id = this.nextId++;
    this.tasks.update((tasks) => [...tasks, { id, title: `Task ${id}` }]);
  }
}

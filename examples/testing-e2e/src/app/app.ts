import { Component, computed, signal } from '@angular/core';

interface Task {
  id: number;
  title: string;
  done: boolean;
}

@Component({
  selector: 'app-root',
  template: `
    <h1>Tasks</h1>

    <form (submit)="add($event, title)">
      <label for="new-task">New task</label>
      <input id="new-task" #title />
      <button type="submit">Add</button>
    </form>

    @if (tasks().length === 0) {
      <p>Nothing to do 🎉</p>
    }
    <ul>
      @for (task of tasks(); track task.id) {
        <li>
          <label><input type="checkbox" [checked]="task.done" (change)="toggle(task.id)" /> {{ task.title }}</label>
        </li>
      }
    </ul>

    <p role="status">{{ open() }} open</p>
  `,
})
export class App {
  protected readonly tasks = signal<Task[]>([]);
  protected readonly open = computed(() => this.tasks().filter((t) => !t.done).length);
  private nextId = 1;

  protected add(event: Event, input: HTMLInputElement): void {
    event.preventDefault(); // no page reload on submit
    const title = input.value.trim();
    if (!title) return;
    this.tasks.update((tasks) => [...tasks, { id: this.nextId++, title, done: false }]);
    input.value = '';
  }

  protected toggle(id: number): void {
    this.tasks.update((tasks) => tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }
}

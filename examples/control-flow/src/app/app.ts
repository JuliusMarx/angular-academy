import { Component, computed, signal } from '@angular/core';

interface Todo {
  id: number;
  title: string;
  done: boolean;
}

@Component({
  selector: 'app-root',
  template: `
    <h1>Todos</h1>

    @if (todos().length === 0) {
      <p>Nothing to do – enjoy your day! 🎉</p>
    } @else {
      <ul>
        @for (todo of todos(); track todo.id) {
          <li>
            <label>
              <input type="checkbox" [checked]="todo.done" (change)="toggle(todo.id)" />
              {{ todo.title }}
            </label>
          </li>
        }
      </ul>
    }

    @switch (openCount()) {
      @case (0) { <p>All done!</p> }
      @case (1) { <p>Only one task left.</p> }
      @default { <p>{{ openCount() }} tasks left.</p> }
    }

    <button type="button" (click)="todos.set([])">Remove all</button>
  `,
})
export class App {
  protected readonly todos = signal<Todo[]>([
    { id: 1, title: 'Learn templates', done: true },
    { id: 2, title: 'Learn control flow', done: false },
    { id: 3, title: 'Learn signals', done: false },
  ]);

  protected readonly openCount = computed(() => this.todos().filter((t) => !t.done).length);

  protected toggle(id: number): void {
    this.todos.update((todos) => todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }
}

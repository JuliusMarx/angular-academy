import { computed, Injectable, signal } from '@angular/core';

export interface Todo {
  id: number;
  title: string;
  done: boolean;
}

@Injectable({ providedIn: 'root' })
export class TodoList {
  private nextId = 1;
  readonly todos = signal<Todo[]>([]);
  readonly remaining = computed(() => this.todos().filter((t) => !t.done).length);

  add(title: string): void {
    this.todos.update((todos) => [...todos, { id: this.nextId++, title, done: false }]);
  }

  toggle(id: number): void {
    this.todos.update((todos) => todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  clearCompleted(): void {
    this.todos.update((todos) => todos.filter((t) => !t.done));
  }
}

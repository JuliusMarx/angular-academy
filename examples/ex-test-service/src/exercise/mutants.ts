// Broken versions of TodoList – your tests should notice each one. No peeking needed. 😉
import { Injectable } from '@angular/core';
import { TodoList } from '../app/todo-list';

@Injectable()
export class AddMutant extends TodoList {
  override add(title: string): void {
    super.add(title);
    this.todos.update((todos) => todos.map((t) => ({ ...t, done: true })));
  }
}

@Injectable()
export class ToggleMutant extends TodoList {
  override toggle(): void {}
}

@Injectable()
export class ClearMutant extends TodoList {
  override clearCompleted(): void {
    this.todos.set([]);
  }
}

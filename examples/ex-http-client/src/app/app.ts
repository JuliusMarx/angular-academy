import { Component, computed, inject, signal } from '@angular/core';
import { Todo, TodoService } from './todo.service';

@Component({
  selector: 'app-root',
  template: `
    <h1>Todos</h1>
    <p id="open-count">{{ openCount() }} open</p>
    <ul>
      @for (todo of todos(); track todo.id) {
        <li [class.done]="todo.done">{{ todo.title }}</li>
      }
    </ul>
  `,
  styles: `
    .done {
      text-decoration: line-through;
    }
  `,
})
export class App {
  private readonly todoService = inject(TodoService);

  // TODO 3: replace this with toSignal(this.todoService.getAll(), { initialValue: [] })
  protected readonly todos = signal<Todo[]>([]);

  protected readonly openCount = computed(() => this.todos().filter((t) => !t.done).length);
}

import { Component, input, output } from '@angular/core';
import { Task } from './task';

/** Shows one task. It doesn't change the task itself – it reports the click to its parent. */
@Component({
  selector: 'app-task-item',
  template: `
    <label>
      <input type="checkbox" [checked]="task().done" (change)="toggled.emit()" />
      <span [class.done]="task().done">{{ task().title }}</span>
    </label>
  `,
  styles: `
    .done {
      text-decoration: line-through;
      color: #595959;
    }
  `,
})
export class TaskItem {
  readonly task = input.required<Task>();
  readonly toggled = output();
}

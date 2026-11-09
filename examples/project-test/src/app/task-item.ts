import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Task } from './task';

/** Shows one task: a checkbox to tick it off and a link to its detail page. */
@Component({
  selector: 'app-task-item',
  imports: [RouterLink],
  template: `
    <!-- A link must not sit inside a <label>, so the checkbox gets its name from aria-label. -->
    <input type="checkbox" [checked]="task().done" [attr.aria-label]="'Done: ' + task().title" (change)="toggled.emit()" />
    <a [routerLink]="['/tasks', task().id]" [class.done]="task().done">{{ task().title }}</a>
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

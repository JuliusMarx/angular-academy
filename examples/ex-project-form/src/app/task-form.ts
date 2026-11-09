import { Component, inject, signal } from '@angular/core';
import { form, FormField, submit } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { FieldErrors } from './field-errors';
import { TaskDraft } from './task';
import { TaskStore } from './task-store';

/** The page /tasks/new */
@Component({
  selector: 'app-task-form',
  imports: [FieldErrors, FormField],
  template: `
    <h1>New task</h1>

    <form (submit)="save($event)" novalidate>
      <p>
        <label for="title">Title</label>
        <input id="title" [formField]="taskForm.title" aria-describedby="title-errors" />
        <app-field-errors id="title-errors" [field]="taskForm.title" />
      </p>
      <p>
        <label for="notes">Notes</label>
        <textarea id="notes" rows="4" [formField]="taskForm.notes" aria-describedby="notes-errors"></textarea>
        <app-field-errors id="notes-errors" [field]="taskForm.notes" />
      </p>
      <button type="submit">Save task</button>
    </form>
  `,
  styles: `
    label,
    input,
    textarea {
      display: block;
      width: min(100%, 30rem);
      font: inherit;
    }
  `,
})
export class TaskForm {
  private readonly store = inject(TaskStore);
  private readonly router = inject(Router);

  protected readonly model = signal<TaskDraft>({ title: '', notes: '' });

  // TODO 1: add a schema function as the second argument of form():
  //   - title is required and has 3 to 80 characters
  //   - notes have at most 500 characters
  protected readonly taskForm = form(this.model);

  protected save(event: Event): void {
    event.preventDefault();
    void submit(this.taskForm, async () => {
      // TODO 2: add the task to the store and navigate to its detail page /tasks/<id>
      return undefined;
    });
  }
}

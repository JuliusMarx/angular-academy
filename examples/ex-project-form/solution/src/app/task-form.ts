import { Component, inject, signal } from '@angular/core';
import { form, FormField, maxLength, minLength, required, submit } from '@angular/forms/signals';
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

  protected readonly taskForm = form(this.model, (path) => {
    required(path.title, { message: 'Please enter a title.' });
    minLength(path.title, 3, { message: 'At least 3 characters.' });
    maxLength(path.title, 80, { message: 'At most 80 characters.' });
    maxLength(path.notes, 500, { message: 'At most 500 characters.' });
  });

  protected save(event: Event): void {
    event.preventDefault();
    // submit() marks every field as touched and only runs the action when the form is valid.
    void submit(this.taskForm, async () => {
      const task = this.store.add(this.model());
      await this.router.navigate(['/tasks', task.id]);
      return undefined;
    });
  }
}

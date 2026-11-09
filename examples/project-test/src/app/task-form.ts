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
      <!-- submitting() is true while the action of submit() runs, i.e. while the POST is on its way -->
      <button type="submit" [disabled]="taskForm().submitting()">
        {{ taskForm().submitting() ? 'Saving …' : 'Save task' }}
      </button>
      <p role="alert">{{ saveError() }}</p>
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
    [role='alert'] {
      color: #b3261e;
    }
  `,
})
export class TaskForm {
  private readonly store = inject(TaskStore);
  private readonly router = inject(Router);

  protected readonly model = signal<TaskDraft>({ title: '', notes: '' });
  protected readonly saveError = signal('');

  protected readonly taskForm = form(this.model, (path) => {
    required(path.title, { message: 'Please enter a title.' });
    minLength(path.title, 3, { message: 'At least 3 characters.' });
    maxLength(path.title, 80, { message: 'At most 80 characters.' });
    maxLength(path.notes, 500, { message: 'At most 500 characters.' });
  });

  protected save(event: Event): void {
    event.preventDefault();
    void submit(this.taskForm, async () => {
      this.saveError.set('');
      try {
        const task = await this.store.add(this.model());
        await this.router.navigate(['/tasks', task.id]);
      } catch {
        this.saveError.set('The task could not be saved. Please try again.');
      }
      return undefined;
    });
  }
}

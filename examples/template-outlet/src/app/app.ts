import { NgTemplateOutlet } from '@angular/common';
import { Component, signal } from '@angular/core';
import { ItemList } from './item-list';

interface Task {
  title: string;
  done: boolean;
}

@Component({
  selector: 'app-root',
  imports: [ItemList, NgTemplateOutlet],
  template: `
    <h1>ng-template</h1>

    <h2>Default row</h2>
    <app-item-list [items]="fruits" />

    <h2>Custom row template</h2>
    <app-item-list [items]="tasks()">
      <!-- let-task gets $implicit, let-i="index" gets the index from the context -->
      <ng-template let-task let-i="index">
        <label>
          <input type="checkbox" [checked]="task.done" (change)="toggle(i)" />
          {{ i + 1 }}. {{ task.title }}
        </label>
      </ng-template>
    </app-item-list>

    <h2>Template reused within the same component</h2>
    <ng-template #badge let-text>
      <span class="badge">{{ text }}</span>
    </ng-template>
    <p>
      <ng-container *ngTemplateOutlet="badge; context: { $implicit: 'new' }" />
      <ng-container *ngTemplateOutlet="badge; context: { $implicit: 'popular' }" />
    </p>
  `,
  styles: `
    .badge {
      margin-right: 0.4rem;
      padding: 0.1rem 0.5rem;
      border-radius: 1rem;
      background: #fce4ee;
      color: #a3134c;
      font-size: 0.85rem;
    }
  `,
})
export class App {
  protected readonly fruits = ['Apple', 'Banana', 'Cherry'];
  protected readonly tasks = signal<Task[]>([
    { title: 'Learn ng-template', done: true },
    { title: 'Write a custom list', done: false },
  ]);

  protected toggle(index: number): void {
    this.tasks.update((tasks) => tasks.map((t, i) => (i === index ? { ...t, done: !t.done } : t)));
  }
}

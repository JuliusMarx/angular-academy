import { Component, ElementRef, signal, viewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <h1>Focus management</h1>

    <!-- 1. Native dialog: open it with the keyboard, press Escape, see where the focus goes -->
    <button type="button" (click)="dialog.showModal()">Delete account …</button>
    <p role="status">{{ result() }}</p>

    <dialog #dialog aria-labelledby="dialog-title" (close)="result.set('Dialog closed with: ' + dialog.returnValue)">
      <h2 id="dialog-title">Delete account?</h2>
      <p>This can't be undone.</p>
      <form method="dialog">
        <button value="cancel" autofocus>Cancel</button>
        <button value="delete">Delete</button>
      </form>
    </dialog>

    <!-- 2. Removing an item: the focus moves to the heading instead of getting lost -->
    <h2 #heading tabindex="-1">Shopping list ({{ items().length }})</h2>
    <ul>
      @for (item of items(); track item) {
        <li>
          {{ item }}
          <button type="button" [attr.aria-label]="'Remove ' + item" (click)="remove(item)">✕</button>
        </li>
      }
    </ul>

    <!-- Try it: delete the line with heading().nativeElement.focus() and remove an item by keyboard -->
  `,
  styles: `
    button:focus-visible,
    h2:focus-visible {
      outline: 3px solid #1a73e8;
      outline-offset: 2px;
    }
    dialog::backdrop {
      background: rgb(0 0 0 / 0.4);
    }
    li button {
      margin-inline-start: 0.5rem;
      padding: 0.1rem 0.5rem;
    }
  `,
})
export class App {
  private readonly heading = viewChild.required<ElementRef<HTMLElement>>('heading');
  protected readonly result = signal('');
  protected readonly items = signal(['Milk', 'Bread', 'Apples', 'Coffee']);

  protected remove(item: string): void {
    this.items.update((items) => items.filter((i) => i !== item));
    this.heading().nativeElement.focus();
  }
}

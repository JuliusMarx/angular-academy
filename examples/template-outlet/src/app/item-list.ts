import { NgTemplateOutlet } from '@angular/common';
import { Component, contentChild, input, TemplateRef } from '@angular/core';

export interface ItemContext<T> {
  $implicit: T;
  index: number;
}

/** Renders a list; the parent decides how a single row looks by passing an <ng-template>. */
@Component({
  selector: 'app-item-list',
  imports: [NgTemplateOutlet],
  template: `
    <ul>
      @for (item of items(); track $index; let i = $index) {
        <li>
          <ng-container *ngTemplateOutlet="rowTemplate() ?? defaultRow; context: { $implicit: item, index: i }" />
        </li>
      } @empty {
        <li class="empty">Nothing here.</li>
      }
    </ul>

    <!-- Used when the parent doesn't pass its own template -->
    <ng-template #defaultRow let-item>{{ item }}</ng-template>
  `,
  styles: `
    ul {
      padding: 0;
      list-style: none;
    }
    li {
      padding: 0.4rem 0;
      border-bottom: 1px solid #eee;
    }
    .empty {
      color: #777;
    }
  `,
})
export class ItemList<T> {
  readonly items = input.required<T[]>();
  /** The first <ng-template> placed between <app-item-list> and </app-item-list>. */
  protected readonly rowTemplate = contentChild<TemplateRef<ItemContext<T>>>(TemplateRef);
}

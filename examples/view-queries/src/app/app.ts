import { afterNextRender, Component, computed, ElementRef, signal, viewChild, viewChildren } from '@angular/core';
import { FaqItem } from './faq-item';

@Component({
  selector: 'app-root',
  imports: [FaqItem],
  template: `
    <h1>FAQ</h1>

    <p>
      <input #search placeholder="Search questions …" (input)="query.set(search.value)" />
      <button type="button" (click)="focusSearch()">Focus search</button>
    </p>

    <p>
      <button type="button" (click)="setAll(true)">Expand all</button>
      <button type="button" (click)="setAll(false)">Collapse all</button>
      {{ openCount() }} of {{ items().length }} open
    </p>

    @for (faq of filtered(); track faq.q) {
      <app-faq-item [question]="faq.q" [answer]="faq.a" />
    }
  `,
})
export class App {
  /** The <input #search> element – a signal, available once the view is rendered. */
  private readonly search = viewChild.required<ElementRef<HTMLInputElement>>('search');
  /** All FaqItem components in the template – updates automatically when @for changes. */
  protected readonly items = viewChildren(FaqItem);
  protected readonly openCount = computed(() => this.items().filter((item) => item.open()).length);

  protected readonly query = signal('');
  private readonly faqs = [
    { q: 'What is a signal?', a: 'A reactive container for a value.' },
    { q: 'What does input() do?', a: 'It declares a property the parent can bind to.' },
    { q: 'What is content projection?', a: 'Passing markup into a component with <ng-content>.' },
  ];
  protected readonly filtered = computed(() =>
    this.faqs.filter((f) => f.q.toLowerCase().includes(this.query().toLowerCase())),
  );

  constructor() {
    // The query is only filled after rendering – so access it there (or in event handlers).
    afterNextRender(() => this.focusSearch());
  }

  protected focusSearch(): void {
    this.search().nativeElement.focus();
  }

  protected setAll(open: boolean): void {
    for (const item of this.items()) item.open.set(open);
  }
}

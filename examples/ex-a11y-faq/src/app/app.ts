import { Component } from '@angular/core';
import { FaqItem } from './faq-item';

@Component({
  selector: 'app-root',
  imports: [FaqItem],
  template: `
    <h1>FAQ</h1>
    <h2>Shipping and returns</h2>

    <app-faq-item question="How long does shipping take?">
      Two to three working days within Germany.
    </app-faq-item>
    <app-faq-item question="Can I return an item?">
      Yes, within 30 days. The return label is in the package.
    </app-faq-item>
    <app-faq-item question="Do you ship abroad?">
      We ship to all EU countries and Switzerland.
    </app-faq-item>
  `,
})
export class App {}

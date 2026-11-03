import { Component, signal } from '@angular/core';

interface Profile {
  name: string;
  city: string;
  newsletter: boolean;
}

@Component({
  selector: 'app-root',
  // TODO 3: import FormField
  imports: [],
  template: `
    <h1>Profile</h1>

    <!-- TODO 2: connect each control with [formField] -->
    <p><label>Name <input id="name" /></label></p>
    <p><label>City <input id="city" /></label></p>
    <p><label><input id="newsletter" type="checkbox" /> Send me the newsletter</label></p>

    <button type="button" (click)="fillExample()">Fill example</button>

    <p id="preview">
      {{ model().name || 'Someone' }} from {{ model().city || 'somewhere' }} ·
      newsletter: {{ model().newsletter ? 'yes' : 'no' }}
    </p>
  `,
})
export class App {
  protected readonly model = signal<Profile>({ name: '', city: '', newsletter: false });

  // TODO 1: create the form from the model with form()

  protected fillExample(): void {
    this.model.set({ name: 'Grace', city: 'Arlington', newsletter: true });
  }
}

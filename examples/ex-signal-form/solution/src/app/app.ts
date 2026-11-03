import { Component, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';

interface Profile {
  name: string;
  city: string;
  newsletter: boolean;
}

@Component({
  selector: 'app-root',
  imports: [FormField],
  template: `
    <h1>Profile</h1>

    <p><label>Name <input id="name" [formField]="profile.name" /></label></p>
    <p><label>City <input id="city" [formField]="profile.city" /></label></p>
    <p><label><input id="newsletter" type="checkbox" [formField]="profile.newsletter" /> Send me the newsletter</label></p>

    <button type="button" (click)="fillExample()">Fill example</button>

    <p id="preview">
      {{ model().name || 'Someone' }} from {{ model().city || 'somewhere' }} ·
      newsletter: {{ model().newsletter ? 'yes' : 'no' }}
    </p>
  `,
})
export class App {
  protected readonly model = signal<Profile>({ name: '', city: '', newsletter: false });
  protected readonly profile = form(this.model);

  protected fillExample(): void {
    this.model.set({ name: 'Grace', city: 'Arlington', newsletter: true });
  }
}

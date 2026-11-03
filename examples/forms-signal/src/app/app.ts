import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { form, FormField, submit } from '@angular/forms/signals';

interface Signup {
  name: string;
  email: string;
  topic: string;
  weekly: boolean;
}

@Component({
  selector: 'app-root',
  imports: [FormField, JsonPipe],
  template: `
    <h1>Newsletter</h1>

    <form (submit)="onSubmit($event)">
      <p>
        <label>Name <input [formField]="signupForm.name" /></label>
      </p>
      <p>
        <label>Email <input type="email" [formField]="signupForm.email" /></label>
      </p>
      <p>
        <label>
          Topic
          <select [formField]="signupForm.topic">
            <option value="angular">Angular</option>
            <option value="typescript">TypeScript</option>
            <option value="css">CSS</option>
          </select>
        </label>
      </p>
      <p>
        <label><input type="checkbox" [formField]="signupForm.weekly" /> Weekly instead of monthly</label>
      </p>
      <button type="submit">Subscribe</button>
    </form>

    <!-- The model signal always holds the current values – no extra wiring needed -->
    <h2>Live model</h2>
    <pre>{{ model() | json }}</pre>

    @if (sent(); as s) {
      <p class="success">Thanks, {{ s.name }}! We'll write to {{ s.email }}.</p>
    }

    <!-- Try it: set the model from code, e.g. a button that calls model.set({ … }) -->
  `,
  styles: `
    .success {
      color: #1e7f4f;
    }
  `,
})
export class App {
  /** The single source of truth: the form reads from and writes to this signal. */
  protected readonly model = signal<Signup>({ name: '', email: '', topic: 'angular', weekly: false });
  protected readonly signupForm = form(this.model);
  protected readonly sent = signal<Signup | null>(null);

  protected onSubmit(event: Event): void {
    event.preventDefault();
    void submit(this.signupForm, async () => {
      // Here you would send the data to a server.
      this.sent.set(this.model());
      return undefined; // no server-side errors
    });
  }
}

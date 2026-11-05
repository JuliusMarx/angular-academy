import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <header>
      <h1>Semantic HTML</h1>
    </header>

    <main>
      <!-- Click into the page and press Tab a few times. Which "button" gets the focus? -->
      <section aria-labelledby="div-title">
        <h2 id="div-title">With divs</h2>
        <input placeholder="Email" (input)="divEmail.set(divInput.value)" #divInput />
        <div class="fake-button" (click)="subscribe(divEmail())">Subscribe</div>
      </section>

      <section aria-labelledby="native-title">
        <h2 id="native-title">With native elements</h2>
        <label for="email">Email</label>
        <input id="email" type="email" (input)="email.set(emailInput.value)" #emailInput />
        <button type="button" [disabled]="!email()" (click)="subscribe(email())">Subscribe</button>
      </section>

      <p role="status">{{ message() }}</p>
    </main>

    <!-- Try it: give the div tabindex="0". It gets the focus now – does Enter work? -->
  `,
  styles: `
    section {
      margin-block: 1rem;
      padding: 1rem;
      border: 1px solid #ccc;
      border-radius: 6px;
    }
    label {
      margin-inline-end: 0.5rem;
    }
    input {
      padding: 0.4rem;
      margin-inline-end: 0.5rem;
      font: inherit;
    }
    .fake-button {
      display: inline-block;
      padding: 0.4rem 0.9rem;
      border: 1px solid #767676;
      border-radius: 3px;
      background: #efefef;
      cursor: pointer;
    }
  `,
})
export class App {
  protected readonly divEmail = signal('');
  protected readonly email = signal('');
  protected readonly message = signal('');

  protected subscribe(email: string): void {
    this.message.set(email ? `Subscribed: ${email}` : 'Please enter an email address.');
  }
}

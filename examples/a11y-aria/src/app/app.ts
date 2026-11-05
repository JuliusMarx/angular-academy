import { Component, signal } from '@angular/core';
import { PasswordField } from './password-field';
import { Toggle } from './toggle';

@Component({
  selector: 'app-root',
  imports: [PasswordField, Toggle],
  template: `
    <h1>ARIA in Angular</h1>

    <h2>Hints with aria-describedby</h2>
    <!-- Two instances – inspect them: each input points to its own hint -->
    <app-password-field />
    <app-password-field />

    <h2>Toggle buttons with aria-pressed</h2>
    <button type="button" appToggle [(pressed)]="muted"><span aria-hidden="true">🔇</span> Mute</button>
    <button type="button" appToggle [(pressed)]="subtitles">Subtitles</button>
    <p>Muted: {{ muted() }}, subtitles: {{ subtitles() }}</p>

    <!-- Try it: open the DevTools (Elements → Accessibility) and watch "pressed" change -->
  `,
  styles: `
    [aria-pressed='true'] {
      background: #1a73e8;
      color: white;
    }
  `,
})
export class App {
  protected readonly muted = signal(false);
  protected readonly subtitles = signal(true);
}

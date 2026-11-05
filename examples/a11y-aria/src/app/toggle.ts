import { Directive, model } from '@angular/core';

/**
 * Turns a native button into a toggle button. Screen readers announce "pressed" or "not pressed".
 * Usage: <button type="button" appToggle [(pressed)]="muted">Mute</button>
 */
@Directive({
  selector: 'button[appToggle]',
  host: {
    '[attr.aria-pressed]': 'pressed()',
    '(click)': 'pressed.set(!pressed())',
  },
})
export class Toggle {
  readonly pressed = model(false);
}

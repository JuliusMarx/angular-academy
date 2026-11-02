import { Directive, input, signal } from '@angular/core';

/**
 * Highlights its host element while the mouse is over it (or it has keyboard focus).
 * Usage: <p appHighlight>…</p> or <p appHighlight="lightblue">…</p>
 */
@Directive({
  selector: '[appHighlight]',
  host: {
    '(mouseenter)': 'active.set(true)',
    '(mouseleave)': 'active.set(false)',
    '(focusin)': 'active.set(true)',
    '(focusout)': 'active.set(false)',
    '[style.backgroundColor]': "active() ? (color() || 'yellow') : null",
    '[style.transition]': "'background-color 0.2s'",
  },
})
export class Highlight {
  /** Same name as the selector, so the attribute value sets the color. */
  readonly color = input('', { alias: 'appHighlight' });
  protected readonly active = signal(false);
}

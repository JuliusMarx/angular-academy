import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Counter } from './counter';

describe('Counter', () => {
  let fixture: ComponentFixture<Counter>;
  let element: HTMLElement;

  /** Finds a button by its text – like a user would. */
  const button = (label: string) =>
    [...element.querySelectorAll('button')].find((b) => b.textContent?.trim() === label) as HTMLButtonElement;

  beforeEach(async () => {
    fixture = TestBed.createComponent(Counter);
    element = fixture.nativeElement;
    await fixture.whenStable(); // wait until Angular has rendered
  });

  it('starts at 0', () => {
    expect(element.querySelector('output')?.textContent).toBe('0');
  });

  it('counts up on click', async () => {
    button('+').click();
    await fixture.whenStable();
    expect(element.querySelector('output')?.textContent).toBe('1');
  });

  it('disables + at the maximum', async () => {
    fixture.componentRef.setInput('max', 2); // set an input from the test
    button('+').click();
    button('+').click();
    await fixture.whenStable();
    expect(button('+').disabled).toBe(true);
  });

  it('emits the new value', async () => {
    const changed = vi.fn();
    fixture.componentInstance.changed.subscribe(changed);
    button('+').click();
    await fixture.whenStable();
    expect(changed).toHaveBeenCalledWith(1);
  });
});

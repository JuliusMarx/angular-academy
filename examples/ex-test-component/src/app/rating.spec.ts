import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Rating } from './rating';

describe('Rating', () => {
  let fixture: ComponentFixture<Rating>;
  let element: HTMLElement;

  const label = () => element.querySelector('.label')?.textContent?.trim();
  const star = (n: number) => element.querySelector(`[aria-label="Rate ${n}"]`) as HTMLButtonElement;

  beforeEach(async () => {
    fixture = TestBed.createComponent(Rating);
    element = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('starts at 0 / 5', () => {
    expect(label()).toBe('0 / 5');
  });

  // TODO 1: set the input with fixture.componentRef.setInput('value', 3) – the label shows "3 / 5"
  // TODO 2: click star 4 – the label shows "4 / 5"
  // TODO 3: click star 2 – the output rated emits 2 (vi.fn() and subscribe)
});

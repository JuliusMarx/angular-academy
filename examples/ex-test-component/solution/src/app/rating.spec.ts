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

  it('shows the value from the input', async () => {
    fixture.componentRef.setInput('value', 3);
    await fixture.whenStable();
    expect(label()).toBe('3 / 5');
  });

  it('updates the label on click', async () => {
    star(4).click();
    await fixture.whenStable();
    expect(label()).toBe('4 / 5');
  });

  it('emits the clicked star', async () => {
    const rated = vi.fn();
    fixture.componentInstance.rated.subscribe(rated);
    star(2).click();
    await fixture.whenStable();
    expect(rated).toHaveBeenCalledWith(2);
  });
});

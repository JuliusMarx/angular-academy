import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TaskItem } from './task-item';

describe('TaskItem', () => {
  let fixture: ComponentFixture<TaskItem>;
  let element: HTMLElement;

  beforeEach(async () => {
    // TaskItem uses routerLink – so the test needs a router, even without routes.
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    fixture = TestBed.createComponent(TaskItem);
    fixture.componentRef.setInput('task', { id: 3, title: 'Add a form', notes: '', done: false });
    element = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('links to the detail page', () => {
    const link = element.querySelector('a');
    expect(link?.textContent?.trim()).toBe('Add a form');
    expect(link?.getAttribute('href')).toBe('/tasks/3');
  });

  it('names the checkbox after the task', () => {
    expect(element.querySelector('input')?.getAttribute('aria-label')).toBe('Done: Add a form');
  });

  it('reports a click on the checkbox', () => {
    const toggled = vi.fn();
    fixture.componentInstance.toggled.subscribe(toggled);
    element.querySelector('input')?.click();
    expect(toggled).toHaveBeenCalledTimes(1);
  });
});

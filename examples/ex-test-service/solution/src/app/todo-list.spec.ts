import { TestBed } from '@angular/core/testing';
import { TodoList } from './todo-list';

describe('TodoList', () => {
  let list: TodoList;

  beforeEach(() => {
    list = TestBed.inject(TodoList);
  });

  it('starts empty', () => {
    expect(list.todos()).toEqual([]);
    expect(list.remaining()).toBe(0);
  });

  it('adds an open todo', () => {
    list.add('Write tests');
    expect(list.todos()).toHaveLength(1);
    expect(list.todos()[0].title).toBe('Write tests');
    expect(list.todos()[0].done).toBe(false);
    expect(list.remaining()).toBe(1);
  });

  it('toggles a todo', () => {
    list.add('Write tests');
    list.toggle(list.todos()[0].id);
    expect(list.todos()[0].done).toBe(true);
    expect(list.remaining()).toBe(0);
  });

  it('clears only the completed todos', () => {
    list.add('Done soon');
    list.add('Still open');
    list.toggle(list.todos()[0].id);
    list.clearCompleted();
    expect(list.todos().map((t) => t.title)).toEqual(['Still open']);
  });
});

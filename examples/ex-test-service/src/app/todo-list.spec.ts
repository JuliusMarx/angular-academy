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

  // TODO 1: test that add() adds an open todo with the given title
  // TODO 2: test that toggle() marks a todo as done – remaining() goes down
  // TODO 3: test that clearCompleted() removes only the done todos
});

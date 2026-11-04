import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Todo {
  id: number;
  title: string;
  done: boolean;
}

@Injectable({ providedIn: 'root' })
export class TodoService {
  // TODO 1: inject HttpClient and load the list from '/api/todos.json'
  getAll(): Observable<Todo[]> {
    return of([]);
  }
}

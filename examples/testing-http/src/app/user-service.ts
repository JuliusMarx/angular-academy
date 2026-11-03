import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';

export interface User {
  id: number;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);

  /** Names of all users, sorted – or an empty list if the server fails. */
  names(): Observable<string[]> {
    return this.http.get<User[]>('/api/users').pipe(
      map((users) => users.map((u) => u.name).sort()),
      catchError(() => of([])),
    );
  }

  rename(id: number, name: string): Observable<User> {
    return this.http.patch<User>(`/api/users/${id}`, { name });
  }
}

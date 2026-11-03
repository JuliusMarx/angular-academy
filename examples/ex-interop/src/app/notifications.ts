import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

/** Plays a live connection (e.g. a WebSocket) – you don't need to change this file. */
@Injectable({ providedIn: 'root' })
export class Notifications {
  private readonly incoming = new Subject<string>();
  /** Emits every new message. Only the service can push – outside it is read-only. */
  readonly messages$: Observable<string> = this.incoming.asObservable();

  simulate(message: string): void {
    this.incoming.next(message);
  }
}

import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { UserService } from './user-service';

describe('UserService', () => {
  let service: UserService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // provideHttpClientTesting() catches every request – nothing goes to a real server.
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(UserService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify(); // fails if a request was sent that the test didn't expect
  });

  it('loads and sorts the names', () => {
    let names: string[] = [];
    service.names().subscribe((n) => (names = n));

    const req = http.expectOne('/api/users');
    expect(req.request.method).toBe('GET');
    req.flush([
      { id: 1, name: 'Grace' },
      { id: 2, name: 'Ada' },
    ]);

    expect(names).toEqual(['Ada', 'Grace']);
  });

  it('returns an empty list when the server fails', () => {
    let names: string[] | undefined;
    service.names().subscribe((n) => (names = n));

    http.expectOne('/api/users').flush('Server error', { status: 500, statusText: 'Internal Server Error' });

    expect(names).toEqual([]);
  });

  it('sends the new name with PATCH', () => {
    service.rename(2, 'Ada Lovelace').subscribe();

    const req = http.expectOne('/api/users/2');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ name: 'Ada Lovelace' });
    req.flush({ id: 2, name: 'Ada Lovelace' });
  });
});

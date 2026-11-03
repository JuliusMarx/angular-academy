import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Weather } from './weather';

describe('Weather', () => {
  let weather: Weather;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    weather = TestBed.inject(Weather);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  const expectBerlin = () => http.expectOne((req) => req.url === '/api/weather' && req.params.get('city') === 'Berlin');

  it('asks for the city', () => {
    weather.forecast('Berlin').subscribe();
    const req = expectBerlin();
    expect(req.request.method).toBe('GET');
    req.flush({ city: 'Berlin', temperature: 10 });
  });

  it('rounds the temperature', () => {
    let result = '';
    weather.forecast('Berlin').subscribe((r) => (result = r));
    expectBerlin().flush({ city: 'Berlin', temperature: 11.6 });
    expect(result).toBe('12 °C');
  });

  it('handles unknown cities', () => {
    let result = '';
    weather.forecast('Berlin').subscribe((r) => (result = r));
    expectBerlin().flush('Not found', { status: 404, statusText: 'Not Found' });
    expect(result).toBe('Unknown city');
  });
});

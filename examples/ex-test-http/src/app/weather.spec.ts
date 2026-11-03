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

  // TODO 1: test that forecast('Berlin') sends GET /api/weather with the parameter city=Berlin
  //         Tip: http.expectOne((req) => req.url === '/api/weather' && req.params.get('city') === 'Berlin')
  // TODO 2: answer with { city: 'Berlin', temperature: 11.6 } – the result is "12 °C"
  // TODO 3: answer with status 404 – the result is "Unknown city"
});

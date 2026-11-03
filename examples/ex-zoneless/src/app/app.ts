import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <h1>Launch</h1>

    <p>Countdown: <strong id="countdown">{{ countdown }}</strong></p>
    @if (countdown === 0) {
      <p id="liftoff">🚀 Liftoff!</p>
    }

    <button type="button" (click)="loadWeather()">Check the weather</button>
    <p id="weather">{{ weather }}</p>
  `,
})
export class App {
  // TODO: Angular doesn't notice when these fields change in a timer or callback.
  //       Turn them into signals – and use .set()/.update() and () in the template.
  protected countdown = 10;
  protected weather = 'Unknown';

  constructor() {
    const timer = setInterval(() => {
      this.countdown--;
      if (this.countdown === 0) clearInterval(timer);
    }, 100);
  }

  protected loadWeather(): void {
    this.weather = 'Loading …';
    setTimeout(() => (this.weather = 'Clear skies'), 300); // pretend to ask a server
  }
}

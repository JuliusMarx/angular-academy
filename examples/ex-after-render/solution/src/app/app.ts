import { afterRenderEffect, Component, ElementRef, signal, viewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <h1>Banner</h1>

    <div #banner class="banner" [class.large]="large()">Summer sale – 20 % off everything!</div>
    <button type="button" (click)="large.set(!large())">Toggle size</button>

    <p>The banner is <strong id="height">{{ height() }}</strong> px high.</p>
  `,
  styles: `
    .banner {
      padding: 1rem;
      background: #fff8c5;
      font-size: 1rem;
    }
    .banner.large {
      padding: 2rem;
      font-size: 1.5rem;
    }
  `,
})
export class App {
  private readonly banner = viewChild.required<ElementRef<HTMLElement>>('banner');
  protected readonly large = signal(false);
  protected readonly height = signal(0);

  constructor() {
    // Runs after the first render and again whenever large() changes – one effect covers both tasks.
    afterRenderEffect(() => {
      this.large();
      this.height.set(this.banner().nativeElement.offsetHeight);
    });
  }
}

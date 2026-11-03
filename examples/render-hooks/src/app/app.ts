import { afterNextRender, afterRenderEffect, Component, ElementRef, signal, viewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <h1>Measuring the DOM</h1>

    <div #box class="box" [class.wide]="wide()">I am a box</div>
    <button type="button" (click)="wide.set(!wide())">Toggle width</button>

    <p>Width measured once after the first render: {{ firstWidth() }} px</p>
    <p>Width measured after every relevant change: {{ width() }} px</p>
    <p>In the constructor the box didn't exist yet: {{ constructorWidth }}</p>
  `,
  styles: `
    .box {
      width: 200px;
      padding: 1rem;
      background: #ddf4ff;
      transition: none;
    }
    .box.wide {
      width: 320px;
    }
  `,
})
export class App {
  private readonly box = viewChild.required<ElementRef<HTMLElement>>('box');
  protected readonly wide = signal(false);
  protected readonly firstWidth = signal(0);
  protected readonly width = signal(0);
  protected readonly constructorWidth: string;

  constructor() {
    // Too early: the template hasn't been rendered yet.
    this.constructorWidth = document.querySelector('.box') ? 'found' : 'not found';

    // Runs once, in the browser only, after Angular has rendered the component.
    afterNextRender(() => this.firstWidth.set(this.box().nativeElement.offsetWidth));

    // Runs after rendering whenever a signal it reads (here: wide) has changed.
    afterRenderEffect(() => {
      this.wide();
      this.width.set(this.box().nativeElement.offsetWidth);
    });
  }
}

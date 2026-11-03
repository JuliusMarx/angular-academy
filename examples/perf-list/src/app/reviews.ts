import { Component } from '@angular/core';

/** Pretend this component is big – @defer loads its code only when it is needed. */
@Component({
  selector: 'app-reviews',
  template: `
    <ul>
      <li>★★★★★ "Best keyboard I ever had."</li>
      <li>★★★★☆ "The mouse could be quieter."</li>
    </ul>
  `,
})
export class Reviews {}

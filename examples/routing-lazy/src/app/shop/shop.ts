import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

/** Frame of the shop area with its own sub-navigation and a nested <router-outlet>. */
@Component({
  selector: 'app-shop-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <h1>Shop</h1>
    <nav class="sub">
      <a routerLink="." routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Products</a>
      <a routerLink="cart" routerLinkActive="active">Cart</a>
    </nav>
    <!-- The child route (ShopList or ShopCart) is rendered here -->
    <router-outlet />
  `,
  styles: `
    .sub {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    .active {
      font-weight: 700;
      color: #c2185b;
    }
  `,
})
export class ShopLayout {}

@Component({
  selector: 'app-shop-list',
  template: `<p>Mug · T-Shirt · Sticker</p>`,
})
export class ShopList {}

@Component({
  selector: 'app-shop-cart',
  template: `<p>Your cart is empty.</p>`,
})
export class ShopCart {}

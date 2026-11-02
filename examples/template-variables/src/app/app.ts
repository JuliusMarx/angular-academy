import { Component, signal } from '@angular/core';

interface Product {
  name: string;
  price: number;
}

@Component({
  selector: 'app-root',
  template: `
    <h1>Shopping cart</h1>

    @let total = totalPrice();
    @let shipping = total >= 50 ? 0 : 4.9;

    <ul>
      @for (item of cart(); track item.name) {
        <li>{{ item.name }} – {{ item.price }} €</li>
      }
    </ul>
    <p>Subtotal: {{ total }} €</p>
    <p>Shipping: {{ shipping === 0 ? 'free 🎉' : shipping + ' €' }}</p>
    <p><strong>Total: {{ total + shipping }} €</strong></p>

    <!-- #productInput is a template reference variable for the <input> element -->
    <input #productInput placeholder="Product name" />
    <button type="button" (click)="add(productInput.value); productInput.value = ''">Add for 10 €</button>

    <!-- Try it: add a @let that counts the items and display it -->
  `,
})
export class App {
  protected readonly cart = signal<Product[]>([
    { name: 'Book', price: 20 },
    { name: 'Mug', price: 12 },
  ]);

  protected totalPrice(): number {
    return this.cart().reduce((sum, p) => sum + p.price, 0);
  }

  protected add(name: string): void {
    if (name.trim()) this.cart.update((items) => [...items, { name, price: 10 }]);
  }
}

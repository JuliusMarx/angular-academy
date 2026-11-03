import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Cart, formatPrice } from './cart';
import { Coupons } from './coupons';

describe('formatPrice', () => {
  it('shows two decimals', () => {
    expect(formatPrice(4)).toBe('€4.00');
    expect(formatPrice(9.5)).toBe('€9.50');
  });
});

describe('Cart', () => {
  let cart: Cart;

  beforeEach(() => {
    // TestBed creates the service the same way the app does – including inject().
    cart = TestBed.inject(Cart);
  });

  it('starts empty', () => {
    expect(cart.items()).toEqual([]);
    expect(cart.total()).toBe(0);
  });

  it('multiplies price and quantity', () => {
    cart.add({ name: 'Coffee', price: 3, quantity: 2 });
    cart.add({ name: 'Cake', price: 4, quantity: 1 });
    expect(cart.total()).toBe(10);
  });

  it('removes items by name', () => {
    cart.add({ name: 'Coffee', price: 3, quantity: 2 });
    cart.remove('Coffee');
    expect(cart.items()).toHaveLength(0);
  });
});

describe('Cart with a coupon', () => {
  it('applies the discount from Coupons', () => {
    // Replace the real dependency with a stand-in – the test controls the discount.
    TestBed.configureTestingModule({
      providers: [{ provide: Coupons, useValue: { discount: signal(0.1) } }],
    });
    const cart = TestBed.inject(Cart);
    cart.add({ name: 'Book', price: 20, quantity: 1 });
    expect(cart.total()).toBe(18);
  });
});

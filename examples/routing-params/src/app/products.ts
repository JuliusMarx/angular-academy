export interface Product {
  id: number;
  name: string;
  price: number;
}

export const PRODUCTS: Product[] = [
  { id: 1, name: 'Mug', price: 12 },
  { id: 2, name: 'T-Shirt', price: 25 },
  { id: 3, name: 'Sticker', price: 3 },
];

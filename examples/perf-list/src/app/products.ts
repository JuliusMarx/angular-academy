export interface Product {
  id: number;
  name: string;
}

/** Counts how often the (pretend) expensive filter runs. */
export const stats = { filterRuns: 0 };

export function filterProducts(products: Product[], query: string): Product[] {
  stats.filterRuns++;
  const q = query.trim().toLowerCase();
  return products.filter((p) => p.name.toLowerCase().includes(q));
}

export const PRODUCTS: Product[] = [
  { id: 1, name: 'Keyboard' },
  { id: 2, name: 'Mouse' },
  { id: 3, name: 'Monitor' },
  { id: 4, name: 'Headphones' },
  { id: 5, name: 'Microphone' },
];

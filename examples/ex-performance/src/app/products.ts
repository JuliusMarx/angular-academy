// You don't need to change this file.
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

export interface Book {
  id: number;
  title: string;
  author: string;
}

export const BOOKS: Book[] = [
  { id: 1, title: 'Foundation', author: 'Isaac Asimov' },
  { id: 2, title: 'Dune', author: 'Frank Herbert' },
  { id: 3, title: 'Neuromancer', author: 'William Gibson' },
];

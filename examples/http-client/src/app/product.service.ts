import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);

  /** The data lives in public/api/products.json – the dev server serves it like a real API. */
  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>('/api/products.json');
  }
}

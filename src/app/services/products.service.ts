import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../environments/environment';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private databaseURL: string = environment.firebase.databaseURL;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http
      .get<Record<string, Omit<Product, 'id'>>>(`${this.databaseURL}/products.json`)
      .pipe(
        map((data) =>
          data
            ? Object.entries(data).map(([key, value]) => ({
                id: key,
                ...value,
              }))
            : [],
        ),
      );
  }

  getQuantity(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.databaseURL}/products/${id}.json`);
  }

  addProduct(product: Omit<Product, 'id'>): Observable<{ name: string }> {
    return this.http.post<{ name: string }>(`${this.databaseURL}/products.json`, product);
  }

  updateProduct(product: Product): Observable<any> {
    const { id, ...updateData } = product;
    return this.http.patch(`${this.databaseURL}/products/${id}.json`, updateData);
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.databaseURL}/products/${id}.json`);
  }
}

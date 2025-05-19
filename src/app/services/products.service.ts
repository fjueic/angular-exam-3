import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Product } from '../models/product.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  databaseURL: string = environment.firebase.databaseURL;
  constructor(private http: HttpClient) {}
  getProducts(): Observable<Product[]> {
    return this.http
      .get<{ [key: string]: any }>(`${this.databaseURL}/products.json`)
      .pipe(
        map((data: any) =>
          data ? Object.keys(data).map((key) => ({ id: key, ...data[key] })) : [],
        ),
      );
  }
  getQuantity(id: string): Observable<any> {
    return this.http.get<{ [key: string]: any }>(`${this.databaseURL}/products/${id}.json`);
  }
  addProduct(product: Product): Observable<any> {
    return this.http.post(`${this.databaseURL}/products.json`, product);
  }
  updateProduct(product: Product): Observable<any> {
    const newValues = { ...product };
    delete newValues.id;
    return this.http.patch(`${this.databaseURL}/products/${product.id}.json`, newValues);
  }
  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.databaseURL}/products/${id}.json`);
  }
}

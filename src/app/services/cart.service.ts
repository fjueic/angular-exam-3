import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Product } from '../models/product.model';

export interface CartItem {
  name: string;
  quantity: number;
  price: number;
}
@Injectable({
  providedIn: 'root',
})
export class CartService {
  private dbUrl: string = environment.firebase.databaseURL;
  private emailid: string | undefined | null = localStorage
    .getItem('emailID')
    ?.replaceAll('.', '')
    .replaceAll('@', '');

  constructor(private http: HttpClient) {
    this.emailid = localStorage.getItem('emailID')?.replaceAll('.', '').replaceAll('@', '');
  }
  addToCart(item: CartItem): Observable<any> {
    if (!this.emailid) {
      throw new Error('Loggin first');
    }
    return this.http.post(`${this.dbUrl}/cart/${this.emailid}.json`, item);
  }
  removeFromCart(product: Product): Observable<any> {
    if (!this.emailid) {
      throw new Error('Log in first');
    }

    return new Observable((observer) => {
      this.getCart().subscribe(
        (data) => {
          const cartKey = Object.keys(data).find((key: any) => data[key].name === product.name);

          if (cartKey) {
            this.http.delete(`${this.dbUrl}/cart/${this.emailid}/${cartKey}.json`).subscribe({
              next: (response) => {
                observer.next(response);
                observer.complete();
              },
              error: (err) => {
                observer.error(err);
              },
            });
          } else {
            observer.error('Product not found in cart');
          }
        },
        (error) => {
          observer.error(error);
        },
      );
    });
  }

  getCart(): Observable<CartItem[]> {
    if (!this.emailid) {
      console.log(this.emailid);
      throw new Error('Loggin first');
    }
    return this.http.get<CartItem[]>(`${this.dbUrl}/cart/${this.emailid}.json`);
  }
  deleteCart(): Observable<any> {
    if (!this.emailid) {
      throw new Error('Loggin first');
    }
    return this.http.delete(`${this.dbUrl}/cart/${this.emailid}.json`);
  }
}

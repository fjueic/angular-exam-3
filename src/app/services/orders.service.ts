import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { CartService } from './cart.service';
import { Order } from '../models/order.model';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private dbUrl: string = environment.firebase.databaseURL;
  private emailid: string | null =
    localStorage.getItem('emailID')?.replaceAll('.', '').replaceAll('@', '') || null;

  constructor(
    private http: HttpClient,
    private cartService: CartService,
    private auth: AuthService,
  ) {}

  placeOrder(): void {
    if (!this.emailid) {
      throw new Error('Login first');
    }

    this.cartService.getCart().subscribe(
      (cartItems) => {
        if (!cartItems) {
          console.error('Cart is empty');
          return;
        }

        const order: Order = {
          id: Date.now(),
          orderDate: new Date().toISOString(),
          orderStatus: 'Processing',
          customerName: localStorage.getItem('name') || 'Unknown',
          customerEmail: localStorage.getItem('emailID') || 'Unknown',
          customerAddress: localStorage.getItem('address') || 'Unknown',
          totalAmoun: Object.values(cartItems).reduce(
            (acc: number, item: any) => acc + item.price,
            0,
          ),
        };

        this.http.post(`${this.dbUrl}/orders/${this.emailid}.json`, order).subscribe({
          next: (res) => {
            this.cartService.deleteCart().subscribe(() => {
              console.log('Order placed and cart cleared');
            });
          },
          error: (err) => console.error('Order failed', err),
        });
      },
      (err) => console.error('Could not get cart', err),
    );
  }
  getOrders(): Observable<Order[]> {
    return this.http.get<Record<string, Record<string, Order>>>(`${this.dbUrl}/orders.json`).pipe(
      map((data) => {
        if (!data) return [];

        let allOrders: (Order & { key: string; userId: string })[] = [];

        for (const userId in data) {
          const userOrders = data[userId];
          for (const key in userOrders) {
            allOrders.push({
              ...userOrders[key],
              key,
              userId,
            });
          }
        }

        const role = this.auth.getUserRole();
        const emailID = this.emailid;

        if (role !== 'admin' && emailID) {
          allOrders = allOrders.filter(
            (order) => order.customerEmail.replaceAll('.', '').replaceAll('@', '') === emailID,
          );
        }

        return allOrders;
      }),
    );
  }

  updateOrderStatus(
    order: Order,
    status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | null,
  ): Observable<any> {
    if (!this.emailid || !order.key || status === null) {
      throw new Error('Missing email ID or Firebase key. Cannot update order.');
    }

    const updateUrl = `${this.dbUrl}/orders/${this.emailid}/${order.key}.json`;

    const updatedOrder = {
      ...order,
      orderStatus: status,
    };

    return this.http.put(updateUrl, updatedOrder);
  }
}

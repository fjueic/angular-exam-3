import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/models/order.model';
import { AuthService } from 'src/app/services/auth.service';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.css'],
})
export class TrackingComponent implements OnInit {
  orders: Order[] = [];

  constructor(
    private orderService: OrdersService,
    private auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.orderService.getOrders().subscribe(
      (data: any) => {
        this.orders = data;
      },
      (err: any) => console.error(err),
    );
  }
  changeStatus(order: Order, status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | null) {
    if (status === null) {
      return;
    }
    this.orderService.updateOrderStatus(order, status).subscribe(
      () => {
        order.orderStatus = status;
      },
      (err: any) => console.error(err),
    );
  }
  isAdmin(): boolean {
    const user = this.auth.getUserRole();
    return user === 'admin';
  }
  getStatusStyle(status: string): { [key: string]: string } {
    switch (status) {
      case 'Processing':
        return { color: 'orange', fontWeight: 'bold' };
      case 'Shipped':
        return { color: 'blue', fontWeight: 'bold' };
      case 'Delivered':
        return { color: 'green', fontWeight: 'bold' };
      case 'Cancelled':
        return { color: 'red', fontWeight: 'bold' };
      default:
        return {};
    }
  }
  onStatusChange(order: Order, event: Event): void {
    const newStatus = (event.target as HTMLSelectElement).value as
      | 'Processing'
      | 'Shipped'
      | 'Delivered'
      | 'Cancelled';

    this.changeStatus(order, newStatus);
  }
}

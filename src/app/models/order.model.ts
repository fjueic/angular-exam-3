export interface Order {
  id: number;
  orderDate: string;
  orderStatus: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  totalAmoun: number;
  key?: string;
}

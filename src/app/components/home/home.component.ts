import { Component } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  UserProducts: any[] = [];
  Products: Product[] = [];
  quantity: { [id: string]: number } = {};
  constructor(
    private products: ProductsService,
    private cart: CartService,
  ) {}
  getProducts() {
    this.products.getProducts().subscribe(
      (data) => {
        this.Products = data;
      },
      (err) => console.log(err),
    );
  }
  ngOnInit() {
    this.getProducts();
    this.getUserProducts();
  }
  addToCart(product: Product) {
    const cartValue = {
      name: product.name,
      price: parseInt(product.price),
      quantity: 1,
    };
    this.cart.addToCart(cartValue).subscribe((data) => {
      console.log('added');
      this.getProducts();
      this.getUserProducts();
    });
  }
  getUserProducts() {
    this.cart.getCart().subscribe(
      (data: any) => {
        this.UserProducts = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
      },
      (err) => console.log(err),
    );
  }
  getCount(name: string) {
    let i = 0;
    this.UserProducts.map((data) => {
      if (data.name == name) i++;
    });
    return i;
  }
}

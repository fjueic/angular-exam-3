import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Product } from 'src/app/models/product.model';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
})
export class InventoryComponent {
  selectedProduct: Product | null = null;
  Products: Product[] = [];
  newName: string = '';
  newDesc: string = '';
  newPrice: string = '';
  newImage: string = '';
  count: number = 0;

  constructor(private productsService: ProductsService) {}

  ngOnInit() {
    this.getProducts();
  }

  incr() {
    this.count++;
  }

  decr() {
    if (this.count > 0) this.count--;
  }

  getProducts() {
    this.productsService.getProducts().subscribe(
      (data) => {
        this.Products = data;
      },
      (err) => console.error(err),
    );
  }

  onSubmit(form: NgForm) {
    if (form.invalid) return;

    const tempData: Product = {
      img: this.newImage,
      name: this.newName,
      description: this.newDesc,
      price: this.newPrice,
      quantity: this.count.toString(),
    };

    if (this.selectedProduct) {
      tempData.id = this.selectedProduct.id;
      this.productsService.updateProduct(tempData).subscribe(
        () => {
          this.resetForm();
          this.getProducts();
          this.selectedProduct = null;
        },
        (err) => console.error(err),
      );
    } else {
      this.productsService.addProduct(tempData).subscribe(
        () => {
          this.resetForm();
          this.getProducts();
        },
        (err) => console.error(err),
      );
    }
  }

  editProduct(product: Product) {
    this.selectedProduct = { ...product };
    this.newName = product.name;
    this.newImage = product.img;
    this.newDesc = product.description;
    this.count = parseInt(product.quantity, 10) || 0;
    this.newPrice = product.price;
  }

  deleteProduct(id: string | undefined) {
    if (!id) return;
    if (confirm('Confirm deletion')) {
      this.productsService.deleteProduct(id).subscribe(
        () => this.getProducts(),
        (err) => console.error(err),
      );
    }
  }

  cancelEdit() {
    this.selectedProduct = null;
    this.resetForm();
  }

  private resetForm() {
    this.newName = '';
    this.newDesc = '';
    this.newPrice = '';
    this.newImage = '';
    this.count = 0;
  }
}

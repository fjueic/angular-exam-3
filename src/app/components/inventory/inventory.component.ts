import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Product } from "src/app/models/product.model";
import { ProductsService } from "src/app/services/products.service";

@Component({
	selector: "app-inventory",
	templateUrl: "./inventory.component.html",
	styleUrls: ["./inventory.component.css"],
})
export class InventoryComponent {
	selectedProduct: Product | null = null;
	Products: Product[] = [];
	newName: string = "";
	newDesc: string = "";
	newPrice: string = "";
	newImage: string = "";
	count: number = 0;
	constructor(private products: ProductsService) {}
	ngOnInit() {
		this.getProducts();
	}
	incr() {
		this.count++;
	}
	decr() {
		this.count--;
	}
	getProducts() {
		this.products.getProducts().subscribe(
			(data) => {
				this.Products = data;
			},
			(err) => console.log(err),
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
		this.products.addProduct(tempData).subscribe(
			(data) => {
				this.newName = "";
				this.newDesc = "";
				this.newPrice = "";
				this.newImage = "";
				this.count = 0;
				this.getProducts();
			},
			(err) => console.log(err),
		);
	}
	editProduct(product: Product) {
		this.selectedProduct = { ...product };
		this.newName = this.selectedProduct.name;
		this.newImage = this.selectedProduct.img;
		this.newDesc = this.selectedProduct.description;
		this.count = parseInt(this.selectedProduct.quantity);
		this.newPrice = this.selectedProduct.price;
	}
	deleteProduct(id: string | undefined) {
		if (!id) return;
		if (confirm("Confirm deletion")) {
			this.products.deleteProduct(id).subscribe(() => this.getProducts);
		}
	}
	updateProduct(product: Product) {
		this.products.updateProduct(product).subscribe(
			(data) => {
				this.selectedProduct = null;
				this.getProducts();
			},
			(err) => console.log(err),
		);
	}
	cancelEdit() {
		this.selectedProduct = null;
	}
}

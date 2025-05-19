import { Component } from "@angular/core";
import { CartService } from "src/app/services/cart.service";
import { ProductsService } from "src/app/services/products.service";

@Component({
	selector: "app-home",
	templateUrl: "./home.component.html",
	styleUrls: ["./home.component.css"],
})
export class HomeComponent {
	UserProducts: any[] = [];
	quantity: { [id: string]: number } = {};
	constructor(
		private products: ProductsService,
		private cart: CartService,
	) {}
	ngOnInit() {
		this.getProducts();
	}
	getProducts() {
		this.products.getProducts().subscribe(
			(data) => {
				this.Products = data;
			},
			(err) => console.log(err),
		);
	}
}

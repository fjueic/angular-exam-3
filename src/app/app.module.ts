import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./components/login/login.component";
import { HomeComponent } from "./components/home/home.component";
import { CartComponent } from "./components/cart/cart.component";
import { OrderComponent } from "./components/order/order.component";
import { InventoryComponent } from "./components/inventory/inventory.component";
import { OrderDetailsComponent } from "./components/order-details/order-details.component";
import { NavBarComponent } from "./components/nav-bar/nav-bar.component";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
// import { environment } from "./environments/environment";
// import { provideAuth, getAuth } from "@angular/fire/auth";
// import { provideFirebaseApp, initializeApp } from "@angular/fire/app";

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		HomeComponent,
		CartComponent,
		OrderComponent,
		InventoryComponent,
		OrderDetailsComponent,
		NavBarComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		FormsModule,
		CommonModule,
		HttpClientModule,
		// provideFirebaseApp(() => initializeApp(environment.firebase)),
		// provideAuth(() => getAuth()),
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}

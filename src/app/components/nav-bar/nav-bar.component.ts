import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";

@Component({
	selector: "app-nav-bar",
	templateUrl: "./nav-bar.component.html",
	styleUrls: ["./nav-bar.component.css"],
})
export class NavBarComponent {
	constructor(
		private auth: AuthService,
		private router: Router,
	) {}
	logout() {
		this.auth.logOut();
		this.router.navigate(["login"]);
	}
}

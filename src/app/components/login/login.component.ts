import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  name: string = '';
  address: string = '';
  isLogin: boolean = true;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private auth: AuthService,
  ) {}

  ngOnInit() {
    if (this.auth.getUserRole()) {
      this.router.navigate(['home']);
    }

    const path = this.router.url;
    this.isLogin = path.includes('login');
  }

  onSubmit(form: NgForm) {
    this.errorMessage = '';

    if (!this.isLogin) {
      this.auth.signUp(this.name, this.email, this.password, this.address).subscribe((success) => {
        if (success) {
          this.router.navigate(['home']);
        } else {
          this.errorMessage = 'Signup failed. Please try again.';
        }
      });
    } else {
      this.auth.logIn(this.email, this.password).subscribe((success) => {
        if (success) {
          this.router.navigate(['home']);
        } else {
          this.errorMessage = 'Login failed. Check your credentials.';
        }
      });
    }
  }

  fillAdmin() {
    this.email = 'admin@gmail.com';
    this.password = 'Admin.123';
  }

  fillUser() {
    this.email = 'user@gmail.com';
    this.password = 'asdfasdf';
  }

  fillUser1() {
    this.email = 'user1@gmail.com';
    this.password = 'asdfasdf';
  }
}

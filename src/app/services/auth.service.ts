import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
  currentUserRole: string = localStorage.getItem('currentUser') || '';
  isLoggedIn: boolean = false;
  signUp(name: string, email: string, password: string, address: string): boolean {
    if (email === '' || name === '' || password === '' || address === '') {
      return false;
    } else {
      let users = JSON.parse(localStorage.getItem('users') || '[]');
      users.push({ name, email, password, address });
      localStorage.setItem('users', JSON.stringify(users));
      this.currentUserRole = 'user';
      localStorage.setItem('currentUser', 'user');
      return true;
    }
  }
  logIn(email: string, password: string): boolean {
    if (email == 'admin@gmail.com' && password == 'Admin.123') {
      this.currentUserRole = 'admin';
      localStorage.setItem('currentUser', 'admin');
      localStorage.setItem('emailID', email);
      return true;
    } else {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      console.log(users[0]);
      const user = users.filter((u: any) => u.email === email && u.password === password);
      if (user) {
        this.currentUserRole = 'user';

        localStorage.setItem('currentUser', 'user');
        localStorage.setItem('emailID', email);
        return true;
      }
      return false;
    }
  }
  getUserRole(): string {
    return this.currentUserRole;
  }
  logOut() {
    this.currentUserRole = '';
    localStorage.removeItem('currentUser');
  }
}

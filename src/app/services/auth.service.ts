import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, of, switchMap } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiKey = environment.firebase.apiKey;
  private databaseURL = environment.firebase.databaseURL;

  private nameSubject = new BehaviorSubject<string | null>(localStorage.getItem('name'));
  private emailSubject = new BehaviorSubject<string | null>(localStorage.getItem('emailID'));
  private addressSubject = new BehaviorSubject<string | null>(localStorage.getItem('address'));

  name$ = this.nameSubject.asObservable();
  email$ = this.emailSubject.asObservable();
  address$ = this.addressSubject.asObservable();

  currentUserRole: string = localStorage.getItem('currentUser') || '';

  constructor(private http: HttpClient) {}

  signUp(name: string, email: string, password: string, address: string) {
    const authUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apiKey}`;
    const payload = { email, password, returnSecureToken: true };

    return this.http.post<any>(authUrl, payload).pipe(
      switchMap((res) => {
        const userId = res.localId;
        const userData = { name, email, address };
        const userUrl = `${this.databaseURL}/users/${userId}.json`;
        return this.http.put(userUrl, userData).pipe(
          map(() => {
            localStorage.setItem('currentUser', 'user');
            localStorage.setItem('emailID', email);
            localStorage.setItem('name', name);
            localStorage.setItem('address', address);
            this.emailSubject.next(email);
            this.nameSubject.next(name);
            this.addressSubject.next(address);
            this.currentUserRole = 'user';
            return true;
          }),
          catchError((err) => {
            console.error('DB write failed', err);
            return of(false);
          }),
        );
      }),
      catchError((err) => {
        console.error('Signup error', err.error?.error?.message);
        return of(false);
      }),
    );
  }

  logIn(email: string, password: string) {
    if (email === 'admin@gmail.com' && password === 'Admin.123') {
      localStorage.setItem('currentUser', 'admin');
      localStorage.setItem('emailID', email);
      localStorage.setItem('name', 'Admin');
      localStorage.setItem('address', 'Admin Address');
      this.emailSubject.next(email);
      this.currentUserRole = 'admin';
      return of(true);
    }

    const loginUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`;
    const payload = { email, password, returnSecureToken: true };

    return this.http.post<any>(loginUrl, payload).pipe(
      switchMap((res) => {
        const userId = res.localId;
        const userUrl = `${this.databaseURL}/users/${userId}.json`;

        return this.http.get<any>(userUrl).pipe(
          map((userData) => {
            localStorage.setItem('currentUser', 'user');
            localStorage.setItem('emailID', email);
            localStorage.setItem('name', userData.name);
            localStorage.setItem('address', userData.address);

            this.emailSubject.next(email);
            this.nameSubject.next(userData.name);
            this.addressSubject.next(userData.address);
            this.currentUserRole = 'user';

            return true;
          }),
          catchError((err) => {
            console.error('User profile fetch failed', err);
            return of(false);
          }),
        );
      }),
      catchError((err) => {
        console.error('Login error:', err.error?.error?.message);
        return of(false);
      }),
    );
  }

  logOut() {
    this.currentUserRole = '';
    localStorage.clear();
    this.nameSubject.next(null);
    this.emailSubject.next(null);
    this.addressSubject.next(null);
  }
  getUserRole() {
    return this.currentUserRole;
  }
}

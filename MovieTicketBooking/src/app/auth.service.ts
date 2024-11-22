import { Injectable } from '@angular/core';
import { LocalstorageService } from './service/localstorage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedIn = false;

  constructor(private local: LocalstorageService) {}

  // Login Method: Checks if user exists in localStorage
  login(email: string, password: string): boolean {
    let users = this.getUsers();
    const user = users.find(
      (u) => u.email === email && u.password === password
    );
    this.isLoggedIn = !!user;
    if (this.isLoggedIn) {
      this.local.set('currentUser', user);
      // localStorage.setItem('currentUser', JSON.stringify(user));
    }
    return this.isLoggedIn;
  }

  // Logout Method: Removes currentUser from localStorage
  logout() {
    this.isLoggedIn = false;
    this.local.remove('currentUser');
    // localStorage.removeItem('currentUser');
  }

  // Check if the user is authenticated
  isAuthenticated(): boolean {
    const user = this.local.get('currentUser');
    const JsonUser = user ? JSON.parse(user) : [];
    return !!JsonUser.token;
    // return !!localStorage.getItem('currentUser');
  }

  hasRole(requiredRole: any): boolean {
    const user = this.local.get('currentUser');
    const userRole = JSON.parse(user || '[]').roleId;
    return userRole === requiredRole;
  }

  // Retrieve all users from localStorage
  private getUsers(): any[] {
    let users = this.local.get('users');
    // let users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  }
}

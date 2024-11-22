import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { LocalstorageService } from '../../service/localstorage.service';
import { AuthService } from '../../auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule, RouterOutlet, RouterLinkActive],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent implements OnInit {
  isLoggedIn: boolean = false;
  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private local: LocalstorageService
  ) {}

  ngOnInit(): void {}

  ngDoCheck(): void {
    const user = this.local.get('currentUser');
    this.isLoggedIn = user ? true : false;
  }

  navigateToLogin() {
    const currentUrl = this.router.url;
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: currentUrl },
    });
  }

  logout() {
    this.authService.logout();
    this.toastr.success('Logged Out Successfully', 'Success', {
      timeOut: 3000,
    });
  }
}

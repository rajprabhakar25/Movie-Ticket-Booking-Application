import { Component, OnInit } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { AuthService } from '../auth.service';
import { LocalstorageService } from '../service/localstorage.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  isLoggedIn: boolean = false;
  constructor(
    private authService: AuthService,
    private router: Router,
    private local: LocalstorageService,
    private toastr: ToastrService
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

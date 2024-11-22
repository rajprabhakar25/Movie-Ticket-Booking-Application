import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { LocalstorageService } from '../../service/localstorage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tadmin-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule, RouterOutlet],
  templateUrl: './tadmin-dashboard.component.html',
  styleUrl: './tadmin-dashboard.component.css',
})
export class TadminDashboardComponent {
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

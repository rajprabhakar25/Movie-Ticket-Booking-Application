import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';
import { LocalstorageService } from '../service/localstorage.service';
import { environment } from '../../environments/environment.development';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  returnUrl: string | null = '';
  type: string = 'password';

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private local: LocalstorageService
  ) {
    this.route.queryParams.subscribe((params) => {
      this.returnUrl = params['returnUrl'] || '/';
    });
  }

  changeType() {
    this.type == 'password' ? (this.type = 'text') : (this.type = 'password');
  }

  login() {
    debugger;
    console.log(environment.baseUrl + 'api/User/login');
    this.apiService
      .login(environment.baseUrl + 'api/User/login', this.email, this.password)
      .subscribe(
        (res: any) => {
          if (res) {
            console.log(res);
            this.local.set('currentUser', JSON.stringify(res));
            this.toastr.success('Login Successfull', 'Success', {
              timeOut: 3000,
            });
            if (res.roleId == '1') {
              this.router.navigate(['/admin-dashboard']);
            } else if (res.roleId == '2') {
              this.router.navigate(['/tadmin-dashboard']);
            } else if (res.roleId == '3') {
              if (this.router.url.includes('admin')) {
                this.returnUrl = '';
              }
              this.router.navigate([
                this.returnUrl ? this.returnUrl : '/dashboard',
              ]);
            }
          } else {
            this.toastr.error('Login Failed', 'Error', {
              timeOut: 3000,
            });
          }
        },
        (err) =>
          this.toastr.error('Invalid Username or Password', 'Error', {
            timeOut: 3000,
          })
      );
  }
}

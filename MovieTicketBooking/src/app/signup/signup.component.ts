import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../service/api.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { LocalstorageService } from '../service/localstorage.service';
import { environment } from '../../environments/environment.development';

@Component({
  standalone: true,
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
  imports: [
    FormsModule,
    RouterLink,
    ReactiveFormsModule,
    CommonModule,
    ToastrModule,
  ],
})
export class SignupComponent implements OnInit {
  formData: FormGroup;
  users: any[] = [];
  emailExists: boolean = false;
  roles: any[] = [];

  passType: string = 'password';
  cPassType: string = 'password';

  constructor(
    private apiService: ApiService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.formData = new FormGroup(
      {
        name: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
        ]),
        email: new FormControl('', [
          Validators.required,
          Validators.email,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
        ]),
        phone: new FormControl('', [
          Validators.required,
          Validators.pattern('^[0-9]{10}$'),
          Validators.maxLength(10),
          Validators.minLength(10),
        ]),
        role: new FormControl('3'),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'
          ),
        ]),
        confirmPassword: new FormControl('', [Validators.required]),
      },
      { validators: [this.passwordMatchValidator, this.emailValidator] }
    );
  }

  changePassType() {
    this.passType == 'password'
      ? (this.passType = 'text')
      : (this.passType = 'password');
  }

  changeCPassType() {
    this.cPassType == 'password'
      ? (this.cPassType = 'text')
      : (this.cPassType = 'password');
  }

  ngOnInit(): void {}

  getUserDetails() {
    this.apiService.get(environment.baseUrl + 'api/User').subscribe(
      (res) => {
        console.log(res);
        this.users = res.users;
        this.roles = res.roles;
      },
      (err) => {
        console.log('An error occured while getting data: ', err);
      }
    );
  }

  passwordMatchValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const formGroup = control as FormGroup;
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { notMatching: true };
  };

  emailValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const formGroup = control as FormGroup;
    const email = formGroup.get('email')?.value;
    this.emailExists = this.users.some(
      (user: { email: any }) => user.email === email
    );
    console.log(this.emailExists);

    return this.emailExists ? { sameEmail: true } : null;
  };

  signup() {
    if (this.formData.valid) {
      const userData = this.formData.value;
      console.log(environment.baseUrl + 'api/User/signup');

      this.apiService
        .post(`${environment.baseUrl}api/User/signup`, userData)
        .toPromise()
        .then(() => {
          this.toastr.success('Registration Successfull', 'Success', {
            timeOut: 3000,
          });
          this.router.navigate(['/login']);
        })
        .catch((err) => {
          this.toastr.error('We are facing server issue', 'Error', {
            timeOut: 3000,
          });
        });
    } else {
      this.toastr.warning('Form Data is Invalid', 'Warning', {
        timeOut: 3000,
      });
    }
  }
}

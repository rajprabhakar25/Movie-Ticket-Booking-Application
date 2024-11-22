import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
  FormArray,
} from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ApiService } from '../../service/api.service';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-admin-add-theatre-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ToastrModule, RouterLink],
  templateUrl: './admin-add-theatre-form.component.html',
  styleUrl: './admin-add-theatre-form.component.css',
})
export class AdminAddTheatreFormComponent implements OnInit {
  formData: FormGroup;
  isEditMode = false;
  emailExists: any;
  users: any[] = [];
  passType: string = 'password';
  cPassType: string = 'password';
  editData: any;

  constructor(
    private apiService: ApiService,
    private toastr: ToastrService,
    private router: Router
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.editData = navigation.extras.state['data'];
      this.isEditMode = !!this.editData;
    }

    this.formData = new FormGroup(
      {
        theatreName: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
        ]),
        location: new FormControl('', [Validators.required]),
        // contactNo: new FormControl('', [
        //   Validators.required,
        //   Validators.pattern('^[0-9]{10}$'),
        //   Validators.maxLength(10),
        //   Validators.minLength(10),
        // ]),
        username: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern("^[A-Za-z]+([A-Za-z' -]*[A-Za-z])?$"),
        ]),
        email: new FormControl('', [
          Validators.required,
          Validators.email,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
        ]),
        mobileNumber: new FormControl('', [
          Validators.required,
          Validators.pattern('^[0-9]{10}$'),
          Validators.maxLength(10),
          Validators.minLength(10),
        ]),
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

  ngOnInit(): void {
    if (this.editData) {
      // this.isEditMode = true;
      this.formData.patchValue(this.editData);
      this.formData.get('password')?.clearValidators();
      this.formData.get('password')?.updateValueAndValidity();
      this.formData.get('confirmPassword')?.clearValidators();
      this.formData.get('confirmPassword')?.updateValueAndValidity();
    }
  }

  passwordMatchValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    // const formGroup = control as FormGroup;
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

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

  getUsers() {
    this.apiService.get(environment.baseUrl + 'api/User').subscribe(
      (res) => {
        console.log(res);
        this.users = res.users;
      },
      (err) => {
        console.log('An error occured while getting data: ', err);
      }
    );
  }

  addTheatre(formValues: any) {
    try {
      this.apiService.postTheatreDetails(formValues).subscribe(
        (res: any) => {
          this.toastr.success('Theatre Added Successfully', 'Success', {
            timeOut: 3000,
          });
          this.router.navigate(['/admin-dashboard']);
          this.formData.reset();
        },
        (err: any) => {
          this.toastr.error('Error Occurred while submitting data', 'Error', {
            timeOut: 3000,
          });
        }
      );
    } catch (err) {
      this.toastr.error('Form Submission Failed', 'Error', {
        timeOut: 3000,
      });
    }
  }

  updateTheatre(theatreId: number, userId: number, data: any) {
    debugger;
    this.apiService
      .updateTheatreDetails(
        `${environment.baseUrl}api/Theatre/${userId}/${theatreId}`,
        data
      )
      .subscribe(
        (res) => {
          this.toastr.success('Theatre Updated Successfully', 'Success', {
            timeOut: 3000,
          });
          this.router.navigate(['/admin-dashboard']);
        },
        (err) =>
          this.toastr.error('Failed to Update Theatre', 'Error', {
            timeOut: 3000,
          })
      );
  }

  onSubmit() {
    if (this.formData.valid) {
      const formData = this.formData.value;
      if (this.isEditMode) {
        // Update existing employee data
        // this.updateEmployee(formData);
        this.updateTheatre(
          this.editData.theatreId,
          this.editData.userId,
          formData
        );
      } else {
        // Add new employee data
        console.log(formData);
        this.addTheatre(formData);
      }
    }
  }
}

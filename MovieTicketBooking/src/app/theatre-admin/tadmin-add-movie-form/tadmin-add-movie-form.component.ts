import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment.development';
import { LocalstorageService } from '../../service/localstorage.service';

@Component({
  selector: 'app-tadmin-add-movie-form',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './tadmin-add-movie-form.component.html',
  styleUrl: './tadmin-add-movie-form.component.css',
})
export class TadminAddMovieFormComponent implements OnInit {
  formData: FormGroup;
  isEditMode = false;
  editData: any;
  movieList: any[] = [];
  userId: any;
  theatreId: any;
  timingId: any;

  constructor(
    private apiService: ApiService,
    private toastr: ToastrService,
    private router: Router,
    private local: LocalstorageService,
    private cdr: ChangeDetectorRef
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.editData = navigation.extras.state['data'];
      this.isEditMode = !!this.editData;
    }

    this.formData = new FormGroup({
      movieId: new FormControl('', [Validators.required]),
      showTime: new FormControl('', [
        Validators.required,
        this.dateValidator(),
      ]),
      availableSeats: new FormControl('', [
        Validators.required,
        Validators.max(100),
      ]),
    });
  }

  ngOnInit(): void {
    const data = JSON.parse(this.local.get('currentUser') || '[]');
    this.userId = data.userId;
    this.apiService
      .get(`${environment.baseUrl}api/Theatre/${this.userId}`)
      .subscribe(
        (res) => {
          if (res) {
            this.theatreId = res.theatreId[0];
            console.log(this.theatreId);
          }
        },
        (err) => {
          console.error('An error occurred while getting data');
        }
      );

    this.apiService.get(`${environment.baseUrl}api/Movie/movies`).subscribe(
      (res) => {
        this.movieList = res;
        console.log(this.movieList);
      },
      (err) => {
        console.error('An error occurred while getting data');
      }
    );

    if (this.editData) {
      this.formData.patchValue(this.editData);
      this.timingId = this.editData.timingId;
    }
  }

  dateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const showTime = control.value;
      if (showTime) {
        const today = new Date();
        const showDate = new Date(showTime);
        if (today > showDate) {
          return { invalidDate: true };
        }
      }
      return null;
    };
  }

  addMovieScreen(formValues: any) {
    try {
      const data = {
        ...formValues,
        theatreId: this.theatreId,
      };
      this.apiService.postScreenDetails(data).subscribe(
        (res: any) => {
          this.toastr.success('Screen Timing Added Successfully', 'Success', {
            timeOut: 3000,
          });
          this.router.navigate(['/tadmin-dashboard/tadmin/home']);
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

  updateMovieScreen(timingId: number, data: any) {
    debugger;
    this.apiService
      .updateMovieDetails(
        `${environment.baseUrl}api/ScreenTiming/${timingId}`,
        data
      )
      .subscribe(
        (res) => {
          this.toastr.success('Screen Timing Updated Successfully', 'Success', {
            timeOut: 3000,
          });
          this.router.navigate(['/tadmin-dashboard/tadmin/home']);
        },
        (err) =>
          this.toastr.error('Failed to Update Movie', 'Error', {
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
        const data = { ...formData, timingId: this.timingId };
        this.updateMovieScreen(this.editData.timingId, data);
      } else {
        // Add new employee data
        console.log(formData);
        this.addMovieScreen(formData);
      }
    }
  }
}

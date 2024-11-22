import { ChangeDetectorRef, Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ApiService } from '../../service/api.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-admin-add-movie-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ToastrModule, RouterLink],
  templateUrl: './admin-add-movie-form.component.html',
  styleUrl: './admin-add-movie-form.component.css',
})
export class AdminAddMovieFormComponent {
  formData: FormGroup;
  isEditMode = false;
  emailExists: any;
  users: any[] = [];
  passType: string = 'password';
  cPassType: string = 'password';
  editData: any;
  image: any;

  constructor(
    private apiService: ApiService,
    private toastr: ToastrService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.editData = navigation.extras.state['data'];
      this.isEditMode = !!this.editData;
    }

    this.formData = new FormGroup({
      movieName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      genre: new FormControl('', [Validators.required]),
      duration: new FormControl('', [Validators.required, Validators.max(240)]),
      releaseDate: new FormControl('', [
        Validators.required,
        this.dateValidator(),
      ]),
    });
  }

  dateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const releaseDate = control.value;
      if (releaseDate) {
        const today = new Date();
        const relDate = new Date(releaseDate);
        if (today > relDate) {
          return { invalidDate: true };
        }
      }
      return null;
    };
  }

  ngOnInit(): void {
    if (this.editData) {
      // this.isEditMode = true;
      this.formData.patchValue(this.editData);
    }
  }

  onFileChange(event: any) {
    const fileInput = event.target;
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64String = reader.result as string;
      console.log(base64String);

      this.image = base64String;
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  addMovie(formValues: any, image: string) {
    try {
      const movieData = {
        ...formValues,
        image: image,
      };
      this.apiService.postMovieDetails(movieData).subscribe(
        (res: any) => {
          this.toastr.success('Movie Added Successfully', 'Success', {
            timeOut: 3000,
          });
          this.router.navigate(['/admin-dashboard/admin/movies']);
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

  updateMovie(movieId: number, data: any) {
    debugger;
    this.apiService
      .updateMovieDetails(`${environment.baseUrl}api/Movie/${movieId}`, data)
      .subscribe(
        (res) => {
          this.toastr.success('Movie Updated Successfully', 'Success', {
            timeOut: 3000,
          });
          this.router.navigate(['/admin-dashboard/admin/movies']);
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
        this.updateMovie(this.editData.movieId, formData);
      } else {
        // Add new employee data
        console.log(formData);
        this.addMovie(formData, this.image);
      }
    }
  }
}

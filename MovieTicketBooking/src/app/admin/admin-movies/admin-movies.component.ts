import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment.development';

declare var bootstrap: any;

@Component({
  selector: 'app-admin-movies',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './admin-movies.component.html',
  styleUrl: './admin-movies.component.css',
})
export class AdminMoviesComponent implements OnInit {
  moviesData: any;
  @ViewChild('deleteModal') deleteModal!: ElementRef;

  constructor(
    private apiService: ApiService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies() {
    this.apiService.get(environment.baseUrl + 'api/Movie/movies').subscribe(
      (res: any) => {
        if (res) {
          this.moviesData = res;
          console.log(this.moviesData);
        }
      },
      (err: any) => {
        console.error('There is an error occurred when calling the api');
      }
    );
  }

  closeModal() {
    const modalElement = this.deleteModal.nativeElement;
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();
  }

  editItem(movieId: any) {
    this.apiService
      .get(`${environment.baseUrl}api/Movie/${movieId}`)
      .subscribe((res: any) => {
        const data = {
          movieId: movieId,
          movieName: res.movieName,
          genre: res.genre,
          duration: res.duration,
          releaseDate: res.releaseDate,
          image: res.image,
        };
        this.router.navigate(['/admin-dashboard/admin/movie-form'], {
          state: { data: data },
        });
        // this.apiService.updateTheatreDetails(`${environment.baseUrl}api/Theatre/${userId}/${theatreId}`, data).subscribe(
        //   (res) => {
        //     this.toastr.success('Data Updated Successfully', 'Success', {
        //       timeOut: 3000,
        //     });
        //   },
        //   (err) => {
        //     this.toastr.error('Data Updation Failed', 'Error', {
        //       timeOut: 3000,
        //     });
        //   }
        // )
      });
  }

  deleteItem(movieId: any) {
    this.apiService
      .delete(environment.baseUrl + 'api/Movie/' + movieId)
      .subscribe(
        (res: any) => {
          // this.closeModal();
          this.toastr.success('Data Deleted Successfully', 'Success', {
            timeOut: 3000,
          });
          this.getMovies();
        },
        (err: any) => {
          this.toastr.error(
            'There is an error while deleting the data',
            'Error',
            {
              timeOut: 3000,
            }
          );
        }
      );
  }
}

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { environment } from '../../../environments/environment.development';
import { LocalstorageService } from '../../service/localstorage.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tadmin-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './tadmin-home.component.html',
  styleUrl: './tadmin-home.component.css',
})
export class TadminHomeComponent implements OnInit {
  moviesData: any;
  userId: any;
  theatreId: any;

  movieList: any[] = [];
  screenTimings: any[] = [];

  constructor(
    private apiService: ApiService,
    private local: LocalstorageService,
    private toastr: ToastrService,
    private router: Router
  ) {}

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
            this.getScreenTimings();
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
  }

  getScreenTimings() {
    this.apiService
      .get(`${environment.baseUrl}api/ScreenTiming/${this.theatreId}`)
      .subscribe(
        (res) => {
          this.screenTimings = res;
          console.log(this.screenTimings);
        },
        (err) => {
          console.error('An error occurred while getting data');
        }
      );
  }

  editItem(timingId: any) {
    this.apiService
      .get(`${environment.baseUrl}api/ScreenTiming/movie/${timingId}`)
      .subscribe((res: any) => {
        const data = {
          timingId: timingId,
          theatreId: res[0].theatreId,
          movieId: res[0].movieId,
          showTime: res[0].showTime,
          availableSeats: res[0].availableSeats,
        };
        this.router.navigate(['/tadmin-dashboard/tadmin/movie-form'], {
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

  deleteItem(timingId: any) {
    this.apiService
      .delete(environment.baseUrl + 'api/ScreenTiming/' + timingId)
      .subscribe(
        (res: any) => {
          this.toastr.success('Data Deleted Successfully', 'Success', {
            timeOut: 3000,
          });
          this.getScreenTimings();
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

  filterMovieDetails(movieId: any) {
    const movie = this.movieList.find((d) => d.movieId == movieId);
    return movie.movieName;
  }

  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    };
    const showDate = new Date(date);
    return showDate.toLocaleDateString('en-GB', options).toUpperCase();
  }

  formatShowTime(date: Date): string {
    const time = new Date(date);
    const showTime = time.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    return showTime;
  }
}

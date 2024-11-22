import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SeatSelectionComponent } from '../seat-selection/seat-selection.component';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { environment } from '../../environments/environment.development';

@Component({
  standalone: true,
  selector: 'app-movie-details',
  imports: [CommonModule, SeatSelectionComponent, FormsModule],
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css'],
})
export class MovieDetailsComponent implements OnInit {
  movieId: string | null = null;
  intMovieId: number = parseInt(this.movieId ?? '0');
  movie: any = {};
  theatres: any[] = [];

  isSeatSelectionOpen = false;
  selectedDate: string | null = null;
  selectedTime: string = '';
  bookedSeats: any = {};

  timeDifferenceInMinutes: number = 0;
  minutesLeft: number = 0;
  bookedSeatNumbers: string = '';
  dateArray: string[] = [];
  date: string = '';
  new: any;

  formatBookedSeats(): void {
    if (this.bookedSeats[this.selectedTime]) {
      this.bookedSeatNumbers = this.bookedSeats[this.selectedTime]
        .map((seat: { number: any }) => seat.number)
        .join(', ');
    }
  }

  today = new Date();
  newDate = new Date(new Date().setDate(this.today.getDate() + 3));

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {
    this.createDateArray(this.today, this.newDate);
  }

  createDateArray(startDate: Date, endDate: Date): void {
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      this.dateArray.push(this.formatDate(currentDate));
      currentDate.setDate(currentDate.getDate() + 1); // Increment by one day
    }
  }

  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    };
    return date.toLocaleDateString('en-GB', options).toUpperCase();
  }

  formatShowTime(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
    };
    const time = new Date(date);
    const showDate = new Date(date)
      .toLocaleDateString('en-GB', options)
      .toUpperCase();
    const showTime = time.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    return showDate + ' ' + showTime;
  }

  convertToDate(formattedDate: string): Date | null {
    const monthMap: { [key: string]: number } = {
      JAN: 0,
      FEB: 1,
      MAR: 2,
      APR: 3,
      MAY: 4,
      JUN: 5,
      JUL: 6,
      AUG: 7,
      SEPT: 8,
      OCT: 9,
      NOV: 10,
      DEC: 11,
    };

    const [_, dayStr, monthStr] = formattedDate.split(' ');

    const day = parseInt(dayStr, 10);
    const month = monthMap[monthStr];
    const year = new Date().getFullYear();

    if (!isNaN(day) && month !== undefined) {
      return new Date(year, month, day);
    }
    return null;
  }

  movies: any;
  screenTimings: any;
  theatresData: any;

  filteredTheatres: any[] = [];

  async getTheatreData() {
    try {
      const theatreRes = await this.apiService
        .get(environment.baseUrl + 'api/Theatre')
        .toPromise();
      console.log(JSON.stringify(theatreRes));
      this.theatresData = theatreRes;
      this.loadTheatres();
    } catch (err) {
      console.log('An Error occurred while getting data');
    }
  }

  async getMoviesData() {
    try {
      const movieRes = await this.apiService
        .get(environment.baseUrl + 'api/Movie')
        .toPromise();
      console.log(JSON.stringify(movieRes));
      this.movies = movieRes.movies;
      this.screenTimings = movieRes.screenTimings;
      this.loadMovieDetails();
      this.loadData();
    } catch (err) {
      console.log('An Error occurred while getting data');
    }
  }

  ngOnInit(): void {
    this.getMoviesData();
    this.getTheatreData();
    this.movieId = this.route.snapshot.paramMap.get('id');
    this.formatBookedSeats();
    this.loadData();
  }

  loadData() {
    this.filteredTheatres = this.theatresData.filter(
      (theatre: { theatreId: any }) =>
        this.screenTimings.some(
          (timing: { movieId: string | null; theatreId: any }) =>
            timing.movieId == this.movieId &&
            timing.theatreId === theatre.theatreId
        )
    );
  }

  getTheatreTimings(theatreId: number) {
    return this.screenTimings.filter(
      (timing: { movieId: string | null; theatreId: number }) =>
        timing.movieId == this.movieId && timing.theatreId === theatreId
    );
  }

  selectTiming(
    timingId: any,
    movieId: number,
    theatreId: number,
    theatreName: string,
    showTime: string,
    seats: number,
    movieName: string
  ) {
    this.selectedTime = showTime.split('T')[1];
    this.selectedDate = showTime.split('T')[0];
    this.router.navigate([
      'dashboard/seat-selection',
      movieId,
      theatreId,
      timingId,
      theatreName,
      showTime,
      seats,
      movieName,
    ]);
  }

  loadMovieDetails(): void {
    const parsedMovieId =
      this.movieId !== null ? parseInt(this.movieId, 10) : null;
    if (parsedMovieId !== null) {
      const selectedMovie = this.movies?.find(
        (movie: { movieId: number }) => movie.movieId === parsedMovieId
      );
      this.movie = selectedMovie;
      console.log(selectedMovie);
    } else {
      console.error('movieIdFromRoute is null');
    }
    console.log('Movie Data: ', this.movies);
  }

  loadTheatres(): void {
    if (this.movieId) {
      this.theatres = this.theatresData[this.movieId] || [];
    }
  }
}

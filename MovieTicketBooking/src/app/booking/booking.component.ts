import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { LocalstorageService } from '../service/localstorage.service';
import { ApiService } from '../service/api.service';
import { environment } from '../../environments/environment.development';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule],
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css',
})
export class BookingComponent implements OnInit {
  bookings: any[] = [];
  screenTimings: any[] = [];
  movies: any[] = [];
  theatres: any[] = [];
  userBookings: any[] = [];
  currentUserId: any;
  today = new Date();

  constructor(
    private router: Router,
    private local: LocalstorageService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.currentUserId = JSON.parse(
      this.local.get('currentUser') || '[]'
    ).userId;
    this.fetchAllData();
  }

  fetchAllData() {
    this.apiService
      .get(environment.baseUrl + 'api/Booking')
      .subscribe((bookings) => {
        this.bookings = bookings.filter(
          (booking: { userId: any }) => booking.userId === this.currentUserId
        );
        this.apiService
          .get(environment.baseUrl + 'api/ScreenTiming')
          .subscribe((screenTimings) => {
            this.screenTimings = screenTimings;
            this.apiService
              .get(environment.baseUrl + 'api/Movie')
              .subscribe((movies) => {
                this.movies = movies.movies;
                this.apiService
                  .get(environment.baseUrl + 'api/Theatre')
                  .subscribe((theatres) => {
                    this.theatres = theatres;
                    this.processUserBookings();
                  });
              });
          });
      });
  }

  processUserBookings() {
    this.bookings.forEach((booking) => {
      const screenTiming = this.screenTimings.find(
        (st) =>
          st.timingId === booking.timingId && new Date(st.showTime) > this.today
      );

      if (screenTiming) {
        const movie = this.movies.find(
          (m) => m.movieId === screenTiming.movieId
        );

        const theatre = this.theatres.find(
          (t) => t.theatreId === booking.theatreId
        );

        if (movie && theatre) {
          this.userBookings.push({
            bookingId: booking.bookingId,
            movieName: movie.movieName,
            theatreName: theatre.theatreName,
            showDate: new Date(screenTiming.showTime).toLocaleDateString(),
            showTime: new Date(screenTiming.showTime).toLocaleTimeString(),
            selectedSeats: booking.selectedSeats,
          });

          console.log(this.userBookings);
        }
      }
    });
  }
}

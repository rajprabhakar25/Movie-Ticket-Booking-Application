import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { LocalstorageService } from '../service/localstorage.service';
import { ApiService } from '../service/api.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment.development';

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule],
  selector: 'app-seat-selection',
  templateUrl: './seat-selection.component.html',
  styleUrls: ['./seat-selection.component.css'],
})
export class SeatSelectionComponent implements OnInit {
  showTime: string = '';
  showDate: string | null = null;
  movieId: string | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() confirmBooking = new EventEmitter<{
    selectedSeats: any[];
    totalPrice: number;
    showTime: string;
    showDate: string;
  }>();

  selectedSeats: number[] = [];
  totalPrice: number = 0;
  char: string = '';
  character: string[] = [];
  date: any;
  showTimeInDate: Date = new Date();
  showDateInDate: Date = new Date();
  noOfSeats: any;
  theatreId: any;
  timingId: any;
  theatreName: any;
  movieName: any;
  seats60: any[] = [];
  seats190: any[] = [];
  bookedSeats: any[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {
    this.date = this.route.snapshot.paramMap.get('showTime');
    this.showTimeInDate = new Date(this.date);
    this.showDateInDate = new Date(this.date ?? '');
  }

  generateSeats(numSeats60: number, numSeats190: number) {
    for (let i = 1; i <= numSeats60; i++) {
      this.seats60.push({ number: `S${i}`, price: 60 });
    }

    for (let i = 1; i <= numSeats190; i++) {
      this.seats190.push({ number: `P${i}`, price: 190 });
    }

    console.log('60 rupees seats: ', this.seats60);
    console.log('190 rupees seats: ', this.seats190);
  }

  ngOnInit(): void {
    this.getBookedSeats();

    this.movieId = this.route.snapshot.paramMap.get('movieId');
    this.theatreId = this.route.snapshot.paramMap.get('theatreId');
    this.timingId = this.route.snapshot.paramMap.get('timingId');
    this.showDate =
      this.route.snapshot.paramMap.get('showTime')?.split('T')[0] ?? '';
    this.date = this.route.snapshot.paramMap.get('showTime');
    this.showTime =
      this.route.snapshot.paramMap.get('showTime')?.split('T')[1] ?? '';
    this.noOfSeats = this.route.snapshot.paramMap.get('seats');
    this.theatreName = this.route.snapshot.paramMap.get('theatreName');
    this.movieName = this.route.snapshot.paramMap.get('movieName');

    const seats60 = 10;
    const seats190 = parseInt(this.noOfSeats) - seats60;
    console.log(seats190);

    this.generateSeats(seats60, seats190);
  }

  getBookedSeats() {
    this.apiService
      .get(environment.baseUrl + 'api/Booking')
      .toPromise()
      .then((res) => {
        console.log(JSON.stringify(res));
        const response = res;
        const filteredData = response.filter(
          (booking: { theatreId: any; timingId: any }) =>
            booking.theatreId == this.theatreId &&
            booking.timingId == this.timingId
        );
        const seats = filteredData
          .map((booking: { selectedSeats: string }) =>
            booking.selectedSeats.split(', ')
          )
          .flat();
        this.bookedSeats = seats;
        console.log(seats);
      })
      .catch((error) => {
        console.error('An error occurred while getting data from bookings');
      });
  }

  isBooked(seat: any): boolean {
    return this.bookedSeats.includes(seat.number);
  }

  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
    };
    return date.toLocaleDateString('en-GB', options).toUpperCase();
  }

  formatTime(showTime: Date): string {
    const time = new Date(showTime);
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  selectSeat(seat: any, price: number) {
    if (this.selectedSeats.includes(seat)) {
      this.selectedSeats = this.selectedSeats.filter((s) => s !== seat);
      this.totalPrice -= price;
    } else {
      this.selectedSeats.push(seat);
      this.totalPrice += price;
    }
  }

  isSelected(seat: any): boolean {
    return this.selectedSeats.includes(seat);
  }

  bookSeats() {
    debugger;
    const navigationExtras: NavigationExtras = {
      state: {
        theatreId: this.theatreId,
        timingId: this.timingId,
        theatreName: this.theatreName,
        selectedSeats: this.selectedSeats,
        totalPrice: this.totalPrice,
        showTime: this.showTime,
        showDate: this.showDate,
        movieName: this.movieName,
      },
    };

    const paymentDetails = {
      theatreId: this.theatreId,
      timingId: this.timingId,
      theatreName: this.theatreName,
      selectedSeats: this.selectedSeats,
      totalPrice: this.totalPrice,
      showTime: this.showTime,
      showDate: this.showDate,
      movieName: this.movieName,
    };

    sessionStorage.setItem('paymentDetails', JSON.stringify(paymentDetails));

    this.router.navigate(['/dashboard/payment']);
  }
}

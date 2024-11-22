import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalstorageService } from '../service/localstorage.service';
import { ApiService } from '../service/api.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css',
})
export class PaymentComponent implements OnInit {
  selectedSeats: any[] = [];
  totalPrice: number = 0;
  showTime: string = '';
  showDate: string = '';
  theatreName: string = '';
  movieName: string = '';
  theatreId: any;
  timingId: any;
  userId: any;

  gstPercentage: number = 18;

  constructor(
    private router: Router,
    private local: LocalstorageService,
    private apiService: ApiService,
    private toastr: ToastrService
  ) {
    const paymentDetails = JSON.parse(
      sessionStorage.getItem('paymentDetails') || '[]'
    );

    const user = JSON.parse(local.get('currentUser') || '[]');

    this.userId = user.userId;
    this.theatreId = paymentDetails.theatreId;
    this.timingId = parseInt(paymentDetails.timingId);
    this.selectedSeats = paymentDetails.selectedSeats;
    this.totalPrice = paymentDetails.totalPrice;
    this.showTime = paymentDetails.showTime;
    this.showDate = paymentDetails.showDate;
    this.theatreName = paymentDetails.theatreName;
    this.movieName = paymentDetails.movieName;
  }

  ngOnInit(): void {}

  onPaymentSuccess() {
    const bookingDetails = {
      theatreId: this.theatreId,
      timingId: this.timingId,
      userId: this.userId,
      selectedSeats: this.getSelectedSeatsString(),
    };

    console.log(JSON.stringify(bookingDetails));

    try {
      this.apiService
        .postBookingsData(bookingDetails)
        .toPromise()
        .then((response) => {
          this.toastr.success('Payment Successfull', 'Success', {
            timeOut: 3000,
          });
          this.apiService
            .updateMovieDetails(
              `${environment.baseUrl}api/ScreenTiming/seats/${bookingDetails.timingId}`,
              bookingDetails
            )
            .subscribe(
              (response) => {
                console.log(
                  `Seats reduced: ${
                    bookingDetails.selectedSeats.split(', ').length
                  }`
                );
              },
              (error) => {
                console.error('Error occurred while updating data', error);
              }
            );
          sessionStorage.clear();
          this.router.navigate(['dashboard/booking']);
        })
        .catch((error) => {
          console.error('There is an issue while posting data: ', error);
        });
    } catch {
      this.toastr.success('Payment Successfull', 'Success', {
        timeOut: 3000,
      });
      console.log('There is some issue in the server');
    }
  }

  getSelectedSeatsString(): string {
    return this.selectedSeats.map((seat) => seat.number).join(', ');
  }

  getTotalAmountWithGST() {
    const gstAmount = (this.totalPrice * this.gstPercentage) / 100;
    return this.totalPrice + gstAmount;
  }
}

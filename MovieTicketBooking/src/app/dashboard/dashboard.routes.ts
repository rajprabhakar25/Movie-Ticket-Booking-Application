import { Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { MovieListComponent } from '../movie-list/movie-list.component';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';
import { BookingComponent } from '../booking/booking.component';
import { AuthGuard } from '../auth.guard';
import { PaymentComponent } from '../payment/payment.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () =>
      import('../home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'movies',
    loadComponent: () =>
      import('../movie-list/movie-list.component').then(
        (m) => m.MovieListComponent
      ),
  },
  {
    path: 'seat-selection/:movieId/:theatreId/:timingId/:theatreName/:showTime/:seats/:movieName',
    loadComponent: () =>
      import('../seat-selection/seat-selection.component').then(
        (m) => m.SeatSelectionComponent
      ),
  },
  { path: 'movie/:id', component: MovieDetailsComponent },
  {
    path: 'booking',
    component: BookingComponent,
    canActivate: [AuthGuard],
  },

  { path: 'payment', component: PaymentComponent, canActivate: [AuthGuard] },
];

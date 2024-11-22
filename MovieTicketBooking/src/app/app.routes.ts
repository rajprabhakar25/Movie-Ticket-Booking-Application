import { provideRouter, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MovieDetailsComponent } from './movie-details/movie-details.component';
import { BookingComponent } from './booking/booking.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AuthGuard } from './auth.guard'; // We'll create this guard later
import { RoleGuard } from './role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ), // Lazy load the DashboardComponent
    loadChildren: () =>
      import('./dashboard/dashboard.routes').then((m) => m.routes),
    data: { role: 3 },
  },
  {
    path: 'admin-dashboard',
    loadComponent: () =>
      import('./admin/admin-dashboard/admin-dashboard.component').then(
        (m) => m.AdminDashboardComponent
      ), // Lazy load the DashboardComponent
    loadChildren: () =>
      import('./admin/admin-dashboard/admin-dashboard.routes').then(
        (m) => m.routes
      ),
    canActivate: [AuthGuard],
    data: { role: 1 },
  },
  {
    path: 'tadmin-dashboard',
    loadComponent: () =>
      import(
        './theatre-admin/tadmin-dashboard/tadmin-dashboard.component'
      ).then((m) => m.TadminDashboardComponent), // Lazy load the DashboardComponent
    loadChildren: () =>
      import('./theatre-admin/tadmin-dashboard/tadmin-dashboard.routes').then(
        (m) => m.routes
      ),
    canActivate: [AuthGuard],
    data: { role: 2 },
  },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: '**', component: NotFoundComponent }, // Wildcard route for a 404 page
];

export const appRoutingProviders = [provideRouter(routes)];

import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'admin/home', pathMatch: 'full' },
  {
    path: 'admin/home',
    loadComponent: () =>
      import('../admin-home/admin-home.component').then(
        (m) => m.AdminHomeComponent
      ),
  },
  {
    path: 'admin/theatre-form',
    loadComponent: () =>
      import('../admin-add-theatre-form/admin-add-theatre-form.component').then(
        (m) => m.AdminAddTheatreFormComponent
      ),
  },
  {
    path: 'admin/movies',
    loadComponent: () =>
      import('../admin-movies/admin-movies.component').then(
        (m) => m.AdminMoviesComponent
      ),
  },
  {
    path: 'admin/movie-form',
    loadComponent: () =>
      import('../admin-add-movie-form/admin-add-movie-form.component').then(
        (m) => m.AdminAddMovieFormComponent
      ),
  },
];

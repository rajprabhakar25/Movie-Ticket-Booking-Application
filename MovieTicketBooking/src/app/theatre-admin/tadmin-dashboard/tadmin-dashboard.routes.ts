import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'tadmin/home', pathMatch: 'full' },
  {
    path: 'tadmin/home',
    loadComponent: () =>
      import('../tadmin-home/tadmin-home.component').then(
        (m) => m.TadminHomeComponent
      ),
  },
  {
    path: 'tadmin/movie-form',
    loadComponent: () =>
      import('../tadmin-add-movie-form/tadmin-add-movie-form.component').then(
        (m) => m.TadminAddMovieFormComponent
      ),
  },
];

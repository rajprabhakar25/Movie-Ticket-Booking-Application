import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../service/api.service';
import { environment } from '../../environments/environment.development';

@Component({
  standalone: true,
  selector: 'app-movie-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.css',
})
export class MovieListComponent implements OnInit {
  movies: any[] = [];

  ngOnInit(): void {
    this.apiService.get(environment.baseUrl + 'api/Movie').subscribe(
      (res) => {
        this.movies = res.movies;
        console.log(this.movies);
      },
      (err) => {
        console.log('An Error occured while getting data');
      }
    );
  }

  constructor(private apiService: ApiService) {}
}

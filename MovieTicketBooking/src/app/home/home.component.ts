import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { LocalstorageService } from '../service/localstorage.service';
import { ApiService } from '../service/api.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment.development';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  user: any | null;
  userName: string | null;
  movies: any[] = [];

  ngOnInit() {
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

  constructor(
    private local: LocalstorageService,
    private apiService: ApiService,
    private toastr: ToastrService
  ) {
    this.user = this.getData();
    if (this.user) {
      this.userName = this.user.username;
    } else {
      this.userName = '';
    }
  }

  getData() {
    let user = this.local.get('currentUser');
    return user ? JSON.parse(user) : [];
  }
}

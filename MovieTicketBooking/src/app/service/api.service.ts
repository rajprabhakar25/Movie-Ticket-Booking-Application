import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  post(url: string, data: any): Observable<any> {
    const filteredData = {
      username: data.name,
      email: data.email,
      mobileNumber: data.phone,
      roleId: parseInt(data.role),
      password: data.confirmPassword,
    };
    return this.http.post(url, filteredData);
  }

  postMovieDetails(data: any): Observable<any> {
    const url = environment.baseUrl + 'api/Movie';
    return this.http.post(url, data);
  }

  postScreenDetails(data: any): Observable<any> {
    const url = environment.baseUrl + 'api/ScreenTiming';
    return this.http.post(url, data);
  }

  postTheatreDetails(data: any): Observable<any> {
    const url = environment.baseUrl + 'api/Theatre';
    return this.http.post(url, data);
  }

  postBookingsData(data: any): Observable<any> {
    const url = environment.baseUrl + 'api/Booking';
    return this.http.post<any>(url, data);
  }

  login(url: string, email: string, password: string): Observable<any> {
    const filteredData = {
      email,
      password,
    };
    return this.http.post(url, filteredData);
  }

  updateTheatreDetails(url: string, data: any): Observable<any> {
    return this.http.put(url, data);
  }

  updateMovieDetails(url: string, data: any): Observable<any> {
    return this.http.put(url, data);
  }

  get(url: string): Observable<any> {
    return this.http.get<any[]>(url);
  }

  delete(url: string): Observable<any> {
    return this.http.delete(url);
  }
}

import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ApiService } from '../../service/api.service';
import { environment } from '../../../environments/environment.development';
import { ToastrService } from 'ngx-toastr';

declare var bootstrap: any;

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [RouterLink, CommonModule, FontAwesomeModule],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.css',
})
export class AdminHomeComponent implements OnInit {
  userTheatreData: any;
  @ViewChild('deleteModal') deleteModal!: ElementRef;

  constructor(
    private apiService: ApiService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  getTheatres() {
    this.apiService.get(environment.baseUrl + 'api/Theatre/Users').subscribe(
      (res: any) => {
        if (res) {
          this.userTheatreData = res;
          console.log(this.userTheatreData);
        }
      },
      (err: any) => {
        console.error('There is an error occurred when calling the api');
      }
    );
  }

  ngOnInit(): void {
    this.getTheatres();
  }

  editItem(userId: any, theatreId: any) {
    this.apiService
      .get(`${environment.baseUrl}api/Theatre/${userId}/${theatreId}`)
      .subscribe((res: any) => {
        const data = {
          userId: userId,
          username: res[0].userName,
          email: res[0].userEmail,
          mobileNumber: res[0].userPhone,
          theatreId: theatreId,
          theatreName: res[0].theatreName,
          location: res[0].location,
        };
        this.router.navigate(['/admin-dashboard/admin/theatre-form'], {
          state: { data: data },
        });
        // this.apiService.updateTheatreDetails(`${environment.baseUrl}api/Theatre/${userId}/${theatreId}`, data).subscribe(
        //   (res) => {
        //     this.toastr.success('Data Updated Successfully', 'Success', {
        //       timeOut: 3000,
        //     });
        //   },
        //   (err) => {
        //     this.toastr.error('Data Updation Failed', 'Error', {
        //       timeOut: 3000,
        //     });
        //   }
        // )
      });
  }

  deleteItem(userId: any) {
    this.apiService
      .delete(environment.baseUrl + 'api/Theatre/' + userId)
      .subscribe(
        (res: any) => {
          // this.closeModal();
          this.toastr.success('Data Deleted Successfully', 'Success', {
            timeOut: 3000,
          });
          this.getTheatres();
        },
        (err: any) => {
          this.toastr.error(
            'There is an error while deleting the data',
            'Error',
            {
              timeOut: 3000,
            }
          );
        }
      );
  }

  closeModal() {
    const modalElement = this.deleteModal.nativeElement;
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();
  }
}

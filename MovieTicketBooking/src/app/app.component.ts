import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LocalstorageService } from './service/localstorage.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'MovieTicketBooking';
  static isBrowser = new BehaviorSubject<boolean>(false);

  showNavbar = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private local: LocalstorageService,
    private router: Router
  ) {
    AppComponent.isBrowser.next(isPlatformBrowser(platformId));

    this.router.events.subscribe(() => {
      this.showNavbar =
        this.router.url.includes('signup') || this.router.url.includes('login');
    });
  }
}

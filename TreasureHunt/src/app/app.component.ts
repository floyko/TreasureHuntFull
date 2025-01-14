import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from './service/auth.service';
import { BoxesComponent } from "./boxes/boxes.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BoxesComponent, CommonModule, NavbarComponent, RouterOutlet, ResetPasswordComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'TreasureHunt';
  loggedIn: boolean = false;
  private subscriptions: Subscription[] = [];

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.subscriptions.push(
      this.authService.isUserLoggedIn$.subscribe((isLoggedIn) => {
        this.loggedIn = isLoggedIn;
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}

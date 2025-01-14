import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from "../register/register.component";
import { SettingsComponent } from "../settings/settings.component";
import { HistoryComponent } from "../history/history.component";
import { AuthService } from '../service/auth.service';
import { SharedService } from '../service/shared.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, LoginComponent, MatButtonModule, MatToolbarModule, RegisterComponent, SettingsComponent, HistoryComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnDestroy, OnInit {
  loggedIn: boolean = false;
  private subscriptions: Subscription[] = [];
  constructor(private authService: AuthService, private sharedService: SharedService) { }

  ngOnInit(): void {
    this.subscriptions.push(
      this.authService.isUserLoggedIn$.subscribe((isLoggedIn) => {
        this.loggedIn = isLoggedIn;
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
  
  logOut(): void {
    localStorage.removeItem("token");
    this.authService.isUserLoggedIn$.next(false);
    window.location.reload();
  }

  startNewGame(): void {
    this.sharedService.newGame();
  }
}

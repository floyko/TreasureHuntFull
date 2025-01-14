import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { ModalService } from '../service/modal.service';
import { StatsService } from '../service/stats.service';
import { AuthService } from '../service/auth.service';
import { ModalComponent } from '../modal/modal.component';
import { ALL_USER_COLUMNS, HISTORY_DATA, RANKED_COLUMNS, RANKED_DATA, YOUR_STATS_COLUMNS } from './history.config';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, MatTabsModule, MatTableModule, ModalComponent],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent implements OnDestroy, OnInit {
  historyModalId: string = "History";
  allUserStats = HISTORY_DATA;
  allUserColumns = ALL_USER_COLUMNS;
  rankedStats = RANKED_DATA;
  rankedColumns = RANKED_COLUMNS;
  yourStats = HISTORY_DATA;
  yourStatsColumns = YOUR_STATS_COLUMNS;
  loggedIn: boolean = false;
  private subscriptions: Subscription[] = [];

  constructor(private authService: AuthService,
    private modalService: ModalService,
    private statsService: StatsService) 
    { }

  ngOnInit(): void {
    this.subscriptions.push(
      this.authService.isUserLoggedIn$.subscribe((isLoggedIn) => {
        this.loggedIn = isLoggedIn
    }));
    if(this.loggedIn) {
      this.getHistory();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  openHistoryModal(): void {
    this.getHistory();
    this.modalService.closeAllModal(this.historyModalId);
    this.modalService.openModal({
      title: this.historyModalId,
      description: this.historyModalId,
      closeButton: "Close",
    }, this.historyModalId);
  }

  getHistory(): void {
    this.getUserHistory();
    this.getAllUserHistory();
    this.getRankedHistory();
  }

  getUserHistory(): void {
    this.subscriptions.push(
      this.statsService.getUserStats().subscribe((stats) => {
        this.yourStats = stats;
      }));
  }

  getAllUserHistory(): void {
    this.subscriptions.push(
      this.statsService.getAllUserStats().subscribe((stats) => {
        this.allUserStats = stats;
      }));
  }

  getRankedHistory(): void {
    this.subscriptions.push(
      this.statsService.getRankedStats().subscribe((rankedStats) => {
        this.rankedStats = rankedStats;
      }));
  }
}

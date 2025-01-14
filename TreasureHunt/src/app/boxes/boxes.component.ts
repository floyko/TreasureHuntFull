import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';
import { ModalService } from '../service/modal.service';
import { ModalComponent } from "../modal/modal.component";
import { AuthService } from '../service/auth.service';
import { StatsService } from '../service/stats.service';
import { distinctUntilChanged, Subscription } from 'rxjs';
import { Stats } from '../models/Stats';
import { SharedService } from '../service/shared.service';

@Component({
  selector: 'app-boxes',
  standalone: true,
  imports: [CommonModule, MatGridListModule, ModalComponent],
  templateUrl: './boxes.component.html',
  styleUrl: './boxes.component.css'
})
export class BoxesComponent implements OnDestroy, OnInit {
  cols: number = 2
  boxes: {backgroundColor: string, className: string, clicked: boolean}[] = [];
  guesses: number = -1;
  guessesAllowed: number = -1;
  guessesRemaining: number = -1;
  answer: number = -1;
  totalBoxes: number = -1;
  modalId: string = "PlayAgain";
  winMessage: string = "You Win!";
  loseMessage: string = "You lose!";
  title: string = "";
  loggedIn: boolean = false;
  gameStatsReset: Stats = {id: -1, userId: -1, username: "test", totalGuesses: -1, guessesAllowed: -1, boxes: -1, winLose: ""};
  gameStats: Stats = this.gameStatsReset;
  disableBoxes: boolean = false;
  private subscriptions: Subscription[] = [];

  constructor(private authService: AuthService, private modalService: ModalService, private sharedService: SharedService, public statsService: StatsService) { }

  ngOnInit(): void {
    this.subscriptions.push(
      this.authService.isUserLoggedIn$.subscribe((isLoggedIn) => {
      this.loggedIn = isLoggedIn
    }));
    if(this.loggedIn) {
      this.getSettings();
      this.subscriptions.push(this.sharedService.newGameEmitter.subscribe(() => {
        this.resetGame();
      }));
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  onBoxClick(box: any): void {
    if(!box.clicked && !this.disableBoxes) {
      if(box.className.slice(10) != this.answer) {
        box.backgroundColor = "red";
        box.clicked = true;
        this.incrementGuesses();
        this.decreaseGuessesRemaining();
        if(this.guessesRemaining === 0) {
          this.playAgainModal("Lose");
        }
      } else {
        box.backgroundColor = "green";
        box.clicked = true;
        this.incrementGuesses();
        this.playAgainModal("Win");
        this.decreaseGuessesRemaining();
      }
    }
  }

  resetGame(): void {
    this.guesses = 0;
    this.answer = Math.floor(Math.random() * this.totalBoxes) + 1;
    this.guessesRemaining = this.guessesAllowed;
    this.gameStats = this.gameStatsReset;
    this.disableBoxes = false;
    this.createGrid(this.totalBoxes);
  }

  incrementGuesses(): void {
    this.guesses++;
  }

  decreaseGuessesRemaining(): void {
    this.guessesRemaining--;
  }

  playAgainModal(result: string): void {
    if(result === "Win") {
      this.title = this.winMessage;
      this.gameStats.winLose = "W";
    } else {
      this.title = this.loseMessage;
      this.gameStats.winLose = "L";
    }
    this.modalService.openModal({
      title: this.title,
      description: "Would you like to play again?",
      saveButton: "Play Again",
      closeButton: "Close"
    }, this.modalId);

    this.disableBoxes = true;
    this.saveGame();
  }

  saveGame(): void {
    this.gameStats.guessesAllowed = this.guessesAllowed;
    this.gameStats.totalGuesses = this.guesses;
    this.gameStats.boxes = this.totalBoxes;
    this.subscriptions.push(
      this.statsService.saveStats(this.gameStats).subscribe());
  }

  playAgainButton(): void {
    this.resetGame();
    this.modalService.closeModal(this.modalId);
  }

  cancelButton(): void {
    this.disableBoxes = true;
  }

  createGrid(numOfBoxes: number): void {
    this.boxes.length = 0;
    this.getCols(numOfBoxes);
    for(let i = 1; i < numOfBoxes + 1; i++)
    {
      this.boxes.push({backgroundColor: "black", className: `box-class-${i}`, clicked: false})
    }
  }

  getSettings(): void {
    this.subscriptions.push(
      this.statsService.boxes$.pipe(distinctUntilChanged())
      .subscribe((num) => {
        this.totalBoxes = num;
        this.resetGame();
    }));
    this.subscriptions.push(
      this.statsService.guessesAllowed$.pipe(distinctUntilChanged())
      .subscribe((num) => {
      this.guessesAllowed = num;
      this.guessesRemaining = num;
    }));
  }

  getCols(numOfBoxes: number): void {    
    if(numOfBoxes < 12) {
      this.cols = 2;
    } else {
      this.cols = 3;
    }
  }
}

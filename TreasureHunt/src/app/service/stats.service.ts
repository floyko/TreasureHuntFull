import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, first, Observable, tap } from 'rxjs';
import { ErrorHandlerService } from './error-handler.service';
import { RankedStats, Stats } from '../models/Stats';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private url = "http://localhost:3000/stats";
  boxes$: BehaviorSubject<number> = new BehaviorSubject<number>(-1);
  guessesAllowed$: BehaviorSubject<number> = new BehaviorSubject<number>(-1);
  private httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  constructor(private errorHandlerService: ErrorHandlerService,
    private httpClient: HttpClient,
    private router: Router) { }

  getUserStats(): Observable<Stats[]> {
    return this.httpClient.get<Stats[]>(`${this.url}/getUserStats`, { responseType: "json" }).pipe(
      catchError(this.errorHandlerService.handleError<Stats[]>("getStats"))
    );
  }

  getAllUserStats(): Observable<Stats[]> {
    return this.httpClient.get<Stats[]>(`${this.url}/getAllUserStats`, { responseType: "json" }).pipe(
      catchError(this.errorHandlerService.handleError<Stats[]>("getStats"))
    );
  }

  getRankedStats(): Observable<RankedStats[]> {
    return this.httpClient.get<RankedStats[]>(`${this.url}/getRankedStats`, { responseType: "json" }).pipe(
      catchError(this.errorHandlerService.handleError<RankedStats[]>("getStats"))
    );
  }

  saveStats(stats: Stats): Observable<Stats> {
    return this.httpClient.post<Stats>(`${this.url}/saveStats`, 
      {totalGuesses: stats.totalGuesses, guessesAllowed: stats.guessesAllowed, boxes: stats.boxes, winLose: stats.winLose}, this.httpOptions)
      .pipe(
      first(), catchError(this.errorHandlerService.handleError<Stats>("saveStats"))
    );
  }

  getSettings(): Observable<{guessesAllowed: User["guessesAllowed"], boxes: User["boxes"]}> {
    return this.httpClient.get<{guessesAllowed: User["guessesAllowed"], boxes: User["boxes"]}>(`${this.url}/getSettings`, { responseType: "json" }).pipe(
      tap((currentSettings: {guessesAllowed: User["guessesAllowed"], boxes: User["boxes"]}) => {
        this.boxes$.next(currentSettings.boxes);
        this.guessesAllowed$.next(currentSettings.guessesAllowed);
      }),
      catchError(this.errorHandlerService.handleError<{guessesAllowed: User["guessesAllowed"], boxes: User["boxes"]}>("getSettings"))
    );
  }

  updateSettings(guessesAllowed: User["guessesAllowed"], boxes: User["boxes"]): 
  Observable<{guessesAllowed: User["guessesAllowed"], boxes: User["boxes"]}> {
    return this.httpClient.post<{guessesAllowed: User["guessesAllowed"], boxes: User["boxes"]}>
    (`${this.url}/updateSettings`, 
      {guessesAllowed: guessesAllowed, boxes: boxes}, this.httpOptions)
      .pipe(
      first(), catchError(this.errorHandlerService.handleError<{guessesAllowed: User["guessesAllowed"], boxes: User["boxes"]}>("updateSettings"))
    );
  }
}

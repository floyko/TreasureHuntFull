import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, catchError, first, Observable, tap } from 'rxjs';
import { User } from '../models/User';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = "http://localhost:3000/auth";
  isUserLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  userId: User["id"] = -1;
  private httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  constructor(private errorHandlerService: ErrorHandlerService, private httpClient: HttpClient) { 
      if(this.getToken()) {
        this.isUserLoggedIn$.next(true);
      }
    }

  register(user: Omit<User, "id">): Observable<User> {
    return this.httpClient.post<User>(`${this.url}/register`, user, this.httpOptions).pipe(
      first(), catchError(this.errorHandlerService.handleError<User>("register"))
    );
  }

  getSecurityQuestions(): Observable<any> {
    return this.httpClient.get(`${this.url}/getSecurityQuestions`, { responseType: "json" });
  }

  login(email: User["email"], password: User["password"]): Observable<{ token: string; userId: User["id"]; }> {
    return this.httpClient.post(`${this.url}/login`, { email, password }, this.httpOptions).pipe(
      first(Object), tap((tokenObject: { token: string; userId: User["id"]; }) => {
        this.userId = tokenObject.userId;
        localStorage.setItem("token", tokenObject.token);
        this.isUserLoggedIn$.next(true);
      }),
      catchError(this.errorHandlerService.handleError<{ token: string; userId: User["id"]; }>("login"))
    );
  }

  getUserSecurityQuestions(email: User["email"]): Observable<{ questionOne: string, questionTwo: string }> {
    return this.httpClient.post<{ questionOne: string, questionTwo: string }>(`${this.url}/getUserSecurityQuestions`, { email }, this.httpOptions).pipe(
      first(), catchError(this.errorHandlerService.handleError<{ questionOne: string, questionTwo: string }>("getUserSecurityQuestions"))
    );
  }

  resetPassword(email: User["email"], password: User["password"], securityAnswerOne: User["securityAnswerOne"], securityAnswerTwo: User["securityAnswerTwo"]):
    Observable<User> {
      return this.httpClient.post<User>(`${this.url}/resetPassword`, {email, password, securityAnswerOne, securityAnswerTwo}, this.httpOptions).pipe(
        first(), catchError(this.errorHandlerService.handleError<User>("resetPassword"))
      );
  }

  getToken() {
    if(typeof window !== "undefined") {
      return localStorage.getItem("token");
    } else {
      return;
    }
  }
}

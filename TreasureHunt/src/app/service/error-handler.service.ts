import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  private errorSubject = new Subject<any>();

  handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      console.log(`${operation} failed: ${error.message}`);

      this.errorSubject.next(error);
      return of(result as T);
    };
  }

  getErrorObservable(): Observable<any> {
    return this.errorSubject.asObservable();
  }
}

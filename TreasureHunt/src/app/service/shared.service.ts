import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  newGameEmitter = new EventEmitter<any>();
  newResetPasswordEmitter = new EventEmitter<any>();

  newGame(): void {
    this.newGameEmitter.emit();
  }

  openPasswordResetModal(email: string): void {
    this.newResetPasswordEmitter.emit(email);
  }
}

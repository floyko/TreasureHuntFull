import { Injectable } from '@angular/core';
import { ModalConfig } from '../modal/modal.config';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalStates: { [key:string]: boolean } = {};
  config = new ModalConfig();

  openModal(config: ModalConfig, modalId: string): void {
    this.config = config;
    this.modalStates[modalId] = true;
  }

  closeModal(modalId: string): void {
    delete this.modalStates[modalId];
  }

  closeAllModal(modalId: string): void {
    this.modalStates = {};
    this.modalStates[modalId] = true;
  }

  isModalOpen(modalId: string): boolean {
    return this.modalStates[modalId] || false;
  }
}
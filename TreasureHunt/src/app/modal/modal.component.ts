import { Component, Input, Output } from '@angular/core';
import { ModalService } from '../service/modal.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  @Input() receivedModalId: string = "";
  @Input() formGroup: FormGroup = new FormGroup("");
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<any>();
  @Output() extra = new EventEmitter<any>();
  
  constructor(private modalService: ModalService) { }

  isOpen(modalId: string) {
    return this.modalService.isModalOpen(modalId);
  }

  get config() {
    return this.modalService.config;
  }
  
  closeModal(modalId: string): void {
    this.modalService.closeModal(modalId);
    this.cancel.emit();
  }

  saveModal(): void {
    if(this.formGroup.valid) {
      this.save.emit("Request Successful");
    } else {
      this.save.emit("All fields are required! Please enter correct information.");
    }
  }

  extraModal(modalId: string): void {
    this.modalService.closeModal(modalId);
    this.extra.emit();
  }
}

import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { ModalComponent } from '../modal/modal.component';
import { ModalService } from '../service/modal.service';
import { StatsService } from '../service/stats.service';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, MatButtonModule, ModalComponent, ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnDestroy, OnInit {
  settingsForm: FormGroup = new FormGroup("");
  settingsModalId: string = "Settings";
  currentSettings: {"guessesAllowed": number, "boxes": number} = {"guessesAllowed": -1, "boxes": -1};
  loggedIn: boolean = false;
  private subscriptions: Subscription[] = [];

  constructor(private authService: AuthService, private formBuilder: FormBuilder,
    private modalService: ModalService,
    private statsService: StatsService) { }
    
  ngOnInit(): void {
    this.subscriptions.push(
      this.authService.isUserLoggedIn$.subscribe((isLoggedIn) => {
        this.loggedIn = isLoggedIn
    }));
    this.createSettingsForm();
    if(this.loggedIn) {
      this.getSettings();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  openSettingsModal(): void {
    this.modalService.closeAllModal(this.settingsModalId);
    this.modalService.openModal({
      title: "Settings",
      description: this.settingsForm,
      saveButton: "Save",
      closeButton: "Cancel",
    }, this.settingsModalId);
  }

  settingsEvent(): void {
    if(this.settingsForm.valid) {
      this.currentSettings.guessesAllowed = this.settingsForm.value.guessesAllowed;
      this.currentSettings.boxes = this.settingsForm.value.boxes;
      this.updateSettings();
      this.modalService.closeModal(this.settingsModalId);
    }
  }

  cancelEvent(): void {
    this.settingsForm.get("guessesAllowed")?.setValue(this.currentSettings.guessesAllowed);
    this.settingsForm.get("boxes")?.setValue(this.currentSettings.boxes);
  }

  getSettings(): void {
    this.subscriptions.push(
      this.statsService.getSettings().subscribe((settings) => {
        this.currentSettings = settings;
        this.settingsForm.get("guessesAllowed")?.setValue(settings.guessesAllowed);
        this.settingsForm.get("boxes")?.setValue(settings.boxes);
    }));
  }

  updateSettings(): void {
    this.subscriptions.push(this.statsService.updateSettings(
      this.currentSettings.guessesAllowed, this.currentSettings.boxes).subscribe());
    this.statsService.boxes$.next(this.currentSettings.boxes);
    this.statsService.guessesAllowed$.next(this.currentSettings.guessesAllowed);
  }

  createSettingsForm(): void {
    this.settingsForm = this.formBuilder.group({
      guessesAllowed: ["", [Validators.required, Validators.min(1)]],
      boxes: ["", [Validators.required, Validators.min(2), Validators.max(21)]]
    });
  }
}

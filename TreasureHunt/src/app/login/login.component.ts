import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ModalService } from '../service/modal.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalComponent } from "../modal/modal.component";
import { AuthService } from '../service/auth.service';
import { Subscription } from 'rxjs';
import { SharedService } from '../service/shared.service';
import { ErrorHandlerService } from '../service/error-handler.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MatButtonModule, ModalComponent, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnDestroy, OnInit {
  error: string = "Email and/or Password is incorrect";
  errors: {email: string, password: string } = {email: "A valid email is required!", password: "Invalid Password"};
  backendError: {email: boolean, password: boolean} = {email: false, password: false};
  loginForm: FormGroup = new FormGroup("");
  loginModalId: string = "Login";
  private subscriptions: Subscription[] = [];

  constructor(private authService: AuthService,
    private errorHandlerService: ErrorHandlerService, private formBuilder: FormBuilder,
    private modalService: ModalService, private sharedService: SharedService) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  openLoginModal() {
    this.modalService.closeAllModal(this.loginModalId);
    this.resetBackendErrors();
    this.modalService.openModal({
      title: "Login",
      description: this.loginForm,
      saveButton: this.loginModalId,
      closeButton: "Cancel",
      extraButton: "Reset Password"
    }, this.loginModalId);
  }

  loginEvent(): void {
    if(this.loginForm.valid) {
      this.resetBackendErrors();
      this.subscriptions.push(
        this.authService.login(
          this.loginForm.value.email, this.loginForm.value.password).subscribe(msg => {
            if(msg) {
              this.modalService.closeModal(this.loginModalId);
            }
          }));
      this.checkForBackendErrors();
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  cancelEvent(): void {
    this.resetLoginForm();
  }

  registerEvent(): void {
    this.sharedService.openPasswordResetModal(this.loginForm.get("email")?.value);
    this.resetLoginForm();
  }

  resetLoginForm(): void {
    this.loginForm.reset();
  }

  checkForBackendErrors(): void {
    this.subscriptions.push(this.errorHandlerService.getErrorObservable().subscribe(err => {
      if(err.error.length > 0) {
        if(err.error[0].path === "email") {
          this.errors.email = err.error[0].msg;
          this.backendError.email = true;
        } else {
          this.errors.email = "";
          this.backendError.email = true;
          this.errors.password = this.error;
          this.backendError.password = true;
        }
      }
    }));
  }

  resetBackendErrors(): void {
    this.backendError.email = false;
    this.backendError.password = false;
  }
}

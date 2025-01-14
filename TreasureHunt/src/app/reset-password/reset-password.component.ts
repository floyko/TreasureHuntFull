import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { ModalService } from '../service/modal.service';
import { ModalComponent } from '../modal/modal.component';
import { ErrorHandlerService } from '../service/error-handler.service';
import { SharedService } from '../service/shared.service';
import { passwordStrengthValidator } from '../validators/custom-validator';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ModalComponent, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnDestroy, OnInit {
  resetPasswordForm: FormGroup = new FormGroup("");
  resetPasswordModalId: string = "Reset Password";
  receivedQuestions: boolean = false;
  private subscriptions: Subscription[] = [];
  backendErrors: {email: boolean, answerOne: boolean, answerTwo: boolean} = {email: false, answerOne: false, answerTwo: false};
  errors: {email: string, answerOne: string, answerTwo: string} = {email: "A valid email is required!", answerOne: "Answer One is required!", answerTwo: "Answer Two is required!"};

  constructor(private authService: AuthService, private errorHandlerService: ErrorHandlerService, private formBuilder: FormBuilder, private snackBar: MatSnackBar,
    private modalService: ModalService, private sharedService: SharedService) {}
  
  ngOnInit(): void {
    this.resetPasswordForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, passwordStrengthValidator()]],
      securityQuestions: this.formBuilder.group({
        securityQuestionOne: new FormControl({ value: "", disabled: true}),
        securityAnswerOne: ["", Validators.required],
        securityQuestionTwo: new FormControl({ value: "", disabled: true}),
        securityAnswerTwo: ["", Validators.required]
      })
    });

    this.subscriptions.push(
      this.sharedService.newResetPasswordEmitter.subscribe((email) => {
        if(email) {
          this.resetPasswordForm.get("email")?.setValue(email);
        }
        this.openResetPasswordModal();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  getUserSecurityQuestions(email: string): void {
    if(email) {
      this.subscriptions.push(
        this.authService.getUserSecurityQuestions(email).subscribe((questions) => {
          if(questions) {
            this.resetPasswordForm.get("securityQuestions.securityQuestionOne")?.setValue(questions.questionOne);
            this.resetPasswordForm.get("securityQuestions.securityQuestionTwo")?.setValue(questions.questionTwo);
            this.receivedQuestions = true;
            this.resetBackendErrors();
            this.resetPasswordForm.get("email")?.setValue(email);
            this.resetPasswordForm.get("email")?.disable();
          }
      }));
      this.checkForBackendErrors();
    } else {
      this.backendErrors.email = true;
    }
  }

  resetPassword(email: string, password: string, securityAnswerOne: string, securityAnswerTwo: string): void {
    this.subscriptions.push(
      this.authService.resetPassword(email, password, securityAnswerOne, securityAnswerTwo).subscribe((msg) => {
        if(msg) {
          this.modalService.closeModal(this.resetPasswordModalId);
          this.resetResetPasswordForm();
          this.snackBar.open("Password successfully updated!", "", {
            duration: 5000,
          });
        } else {
          this.checkForBackendErrors();
        }
      }));
  }

  openResetPasswordModal(): void {
    this.modalService.closeAllModal(this.resetPasswordModalId);
    this.modalService.openModal({
      title: this.resetPasswordModalId,
      description: this.resetPasswordForm,
      saveButton: this.resetPasswordModalId,
      closeButton: "Cancel",
    }, this.resetPasswordModalId);
  }

  resetPasswordEvent(): void {
    let email = this.resetPasswordForm.get("email")?.value;
    let password = this.resetPasswordForm.get("password")?.value;
    let securityAnswerOne = this.resetPasswordForm.get("securityQuestions.securityAnswerOne")?.value;
    let securityAnswerTwo = this.resetPasswordForm.get("securityQuestions.securityAnswerTwo")?.value;
    if(!this.receivedQuestions) {
      this.getUserSecurityQuestions(email);
    } else {
      if(this.resetPasswordForm.valid) {
        this.resetPassword(email, password, securityAnswerOne, securityAnswerTwo);
      } else {
        this.resetPasswordForm.markAllAsTouched();
      }
    }
  }

  cancelEvent(): void {
    this.resetResetPasswordForm();
  }

  resetResetPasswordForm(): void {
    this.resetPasswordForm.reset();
    this.receivedQuestions = false;
    this.resetBackendErrors();
    this.resetPasswordForm.get("email")?.enable();
  }

  checkForBackendErrors(): void {
    this.subscriptions.push(this.errorHandlerService.getErrorObservable().subscribe(err => {
      if(err.error.length > 0) {
        for(let i = 0; i < err.error.length; i++) {
          if(err.error[i].path === "email") {
            this.backendErrors.email = true;
            this.errors.email = err.error[i].msg;
          } else if(err.error[i].path === "securityQuestionOne") {
            this.backendErrors.answerOne = true;
            this.errors.answerOne = err.error[i].msg;
          } else if(err.error[i].path === "securityQuestionTwo") {
            this.backendErrors.answerTwo = true;
            this.errors.answerTwo = err.error[i].msg;
          }
        }
      }
    }));
  }

  resetBackendErrors(): void {
    this.backendErrors.email = false;
    this.backendErrors.answerOne = false;
    this.backendErrors.answerTwo = false;
  }

  checkIfUpdating(controlName: string): void {
    if(this.resetPasswordForm.get(controlName)?.touched && controlName === "email" && this.backendErrors.email) {
      this.backendErrors.email = false;
    } else if(this.resetPasswordForm.get(controlName)?.touched && controlName === "securityQuestions.securityAnswerOne" && this.backendErrors.answerOne) {
      this.backendErrors.answerOne = false;
    } else if(this.resetPasswordForm.get(controlName)?.touched && controlName === "securityQuestions.securityAnswerTwo" && this.backendErrors.answerTwo) {
      this.backendErrors.answerTwo = false;
    }
  }
}

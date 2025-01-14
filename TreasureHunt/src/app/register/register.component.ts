import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ModalComponent } from "../modal/modal.component";
import { ModalService } from '../service/modal.service';
import { AuthService } from '../service/auth.service';
import { passwordStrengthValidator } from '../validators/custom-validator';
import { ErrorHandlerService } from '../service/error-handler.service';
import { DEFAULT_ERRORS } from '../models/default-errors';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, MatButtonModule, ModalComponent, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnDestroy, OnInit {
  registerForm: FormGroup = new FormGroup("");
  registerModalId: string = "Register";
  registerQuestionOptions: {id: number, question: string}[] = [{id: -1, question: ""}, {id: 0, question: ""}];
  registerQuestionOneOptions: {id: number, question: string}[] = [{id: -1, question: ""}];
  registerQuestionTwoOptions: {id: number, question: string}[] = [{id: -1, question: ""}];
  preSelectedQuestions: number[] = [];
  private subscriptions: Subscription[] = [];
  errors: Map<string, {msg?: string, backendErrors: boolean}> = new Map([
    ["username", {msg: DEFAULT_ERRORS.get("username"), backendErrors: false}],
    ["email", {msg: DEFAULT_ERRORS.get("email"), backendErrors: false}],
    ["password", {msg: DEFAULT_ERRORS.get("password"), backendErrors: false}],
    ["securityAnswerOne", {msg: DEFAULT_ERRORS.get("securityAnswerOne"), backendErrors: false}],
    ["securityAnswerTwo", {msg: DEFAULT_ERRORS.get("securityAnswerTwo"), backendErrors: false}]
  ]);

  constructor(private authService: AuthService, private errorHandlerService: ErrorHandlerService,
    private formBuilder: FormBuilder, private snackBar: MatSnackBar,
    private modalService: ModalService) { }
  
  
  ngOnInit(): void {
    this.getSecurityQuestions();
    this.registerForm = this.formBuilder.group({
      username: ["", [Validators.required, Validators.minLength(6)]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, passwordStrengthValidator()]],
      securityQuestions: this.formBuilder.group({
        securityQuestionOne: [this.preSelectedQuestions[0], Validators.required],
        securityAnswerOne: ["", Validators.required],
        securityQuestionTwo: [this.preSelectedQuestions[1], Validators.required],
        securityAnswerTwo: ["", Validators.required]
      })
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  openRegisterModal(): void {
    this.modalService.closeAllModal(this.registerModalId);
    this.modalService.openModal({
      title: "Register",
      description: this.registerForm,
      saveButton: this.registerModalId,
      closeButton: "Cancel",
    }, this.registerModalId);
  }

  registerEvent(): void {
    if(this.registerForm.valid) {
      this.subscriptions.push(
        this.authService.register(this.registerForm.value).subscribe((msg) => {
          if(msg) {
            this.resetRegisterForm();
            this.modalService.closeModal(this.registerModalId);
            this.snackBar.open("User successfully registered. Please login!", "", {
              duration: 5000,
            });
          }
        }));
      this.checkForBackendErrors();
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  cancelEvent(): void {
    this.resetRegisterForm();
  }

  getSecurityQuestions(): void {
    if(this.registerQuestionOptions.length < 3) {
      this.subscriptions.push(
        this.authService.getSecurityQuestions().subscribe((questions) => {
          this.registerQuestionOptions = questions;
        }));
    }

    this.registerQuestionOneOptions = this.registerQuestionOptions;
    this.registerQuestionTwoOptions = this.registerQuestionOptions;
    this.preSelectedQuestions.push(this.registerQuestionOptions[0].id);
    this.preSelectedQuestions.push(this.registerQuestionOptions[1].id);

    // filter out pre-selected questions
    this.questionOneDropdownFilter(this.preSelectedQuestions[1]);
    this.questionTwoDropdownFilter(this.preSelectedQuestions[0]);
  }

  fiterSecurityQuestions(event: Event, questionNum: number): void {
    const value = Number((event.target as HTMLInputElement).value);
    if(questionNum === 1) {
      this.questionTwoDropdownFilter(value);
    } else if (questionNum === 2) {
      this.questionOneDropdownFilter(value)
    }
  }

  questionOneDropdownFilter(id: number): void {
    this.registerQuestionOneOptions = this.registerQuestionOptions;
    this.registerQuestionOneOptions = this.registerQuestionOneOptions.filter((option) => option.id !== id);
  }

  questionTwoDropdownFilter(id: number): void {
    this.registerQuestionTwoOptions = this.registerQuestionOptions;
    this.registerQuestionTwoOptions = this.registerQuestionTwoOptions.filter((option) => option.id !== id);
  }

  resetRegisterForm(): void {
    this.registerForm.reset();
    this.registerForm.get("securityQuestions.securityQuestionOne")?.setValue(this.registerQuestionOptions[0].id);
    this.registerForm.get("securityQuestions.securityQuestionTwo")?.setValue(this.registerQuestionOptions[1].id);
  }

  checkForBackendErrors(): void {
    this.subscriptions.push(this.errorHandlerService.getErrorObservable().subscribe(err => {
      if(err.error.length > 0) {
        for(let i = 0; i < err.error.length; i++) {
          switch(err.error[i].path) {
            case "username":
              this.errors.set("username", { ...this.errors.get("username"), msg: err.error[i].msg, backendErrors: true });
              break;
            case "email":
              this.errors.set("email", { ...this.errors.get("email"), msg: err.error[i].msg, backendErrors: true });
              break;
            case "password":
              this.errors.set("password", { ...this.errors.get("password"), msg: err.error[i].msg, backendErrors: true });
              break;
            case "securityQuestions.securityAnswerOne":
              this.errors.set("securityAnswerOne", { ...this.errors.get("securityAnswerOne"), msg: err.error[i].msg, backendErrors: true });
              break;
            case "securityQuestions.securityAnswerTwo":
              this.errors.set("securityAnswerTwo", { ...this.errors.get("securityAnswerTwo"), msg: err.error[i].msg, backendErrors: true });
              break;
          }
        }
      }
    }));
  }

  checkIfUpdating(controlName: string): void {
    let newControlName = "";
    if(controlName === "securityAnswerOne") {
      newControlName = "securityQuestions." + controlName;
    } else if(controlName === "securityAnswerTwo") {
      newControlName = "securityQuestions." + controlName;
    }

    if(newControlName) {
      if(this.registerForm.get(newControlName)?.touched && this.errors.get(controlName)?.backendErrors) {
        this.registerForm.get(newControlName)?.markAsUntouched;
        this.errors.set(controlName, { ...this.errors.get(controlName), msg: DEFAULT_ERRORS.get(controlName), backendErrors: false });
      }
    } else {
      if(this.registerForm.get(controlName)?.touched && this.errors.get(controlName)?.backendErrors) {
        this.registerForm.get(controlName)?.markAsUntouched;
        this.errors.set(controlName, { ...this.errors.get(controlName), msg: DEFAULT_ERRORS.get(controlName), backendErrors: false });
      }
    }
  }
}

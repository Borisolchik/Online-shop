import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../../core/auth/auth.service";
import {LoginResponseType} from "../../../../types/login-response.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm = this.fb.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required]],
    rememberMe: [false]
  })

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private _snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
  }

  login(): void {
   if (this.loginForm.valid && this.loginForm.value.email && this.loginForm.value.password) {
     this.authService.login(this.loginForm.value.email, this.loginForm.value.password, !!this.loginForm.value.rememberMe)
       .subscribe({
         next: (data: LoginResponseType | DefaultResponseType) => {
           let error = null;
           if ((data as DefaultResponseType).error !== undefined) {
             error = (data as DefaultResponseType). message;
           }
           if (!(data as LoginResponseType).accessToken || !(data as LoginResponseType).refreshToken || !(data as LoginResponseType).userId) {
             error = 'Ошибка авторизации';
           }
           if (error) {
             this._snackBar.open(error);
             throw new Error(error);
           }
         },
         error: (errorResponse: HttpErrorResponse) => {
           if (errorResponse.error && errorResponse.error.message) {
             this._snackBar.open(errorResponse.error.message);
           } else {
             this._snackBar.open('Ошибка авторизации');
           }
         }
       })
   }
  }
}

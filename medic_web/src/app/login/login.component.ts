import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonModule, NgClass} from "@angular/common";
import {LoginAuthRequest} from "../helper/auth/authDataService";
import {AuthService} from "../helper/auth/myAuthService";
import {Router} from "@angular/router";
import {catchError, of} from "rxjs";
import {HttpClientModule} from "@angular/common/http";
import {SnackbarBar} from "../helper/mat-snackbar/snack-bar";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    NgClass,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  public loginRequest:LoginAuthRequest={
    username:"",
    password:""
  };
  registerForm!:FormGroup
  submitted = false;

  constructor(private formBuilder: FormBuilder,
              private authService:AuthService,
              private router:Router,
              private snackBar:SnackbarBar) {

  }
  ngOnInit(): void {
    this.registerForm=this.formBuilder.group({
      username:['', [Validators.required]],
      password:['', [Validators.required]]
    })
  }

  signIn() {
    this.loginRequest.username=this.registerForm.get('username')?.value;
    this.loginRequest.password= this.registerForm.get('password')?.value;

    this.authService.signIn(this.loginRequest).pipe(
      catchError(error => {
        if (error.status === 400) {
          this.snackBar.openSnackBarCrveni("Bad request error: Invalid username or password.")
        } else if (error.status === 404) {
          this.snackBar.openSnackBarCrveni("Forbidden: You do not have the required permissions.")
        } else {
          this.snackBar.openSnackBarCrveni("An unexpected error occurred.")
        }

        return of(null);
      })
    ).subscribe(async x=>{
      if (x && !x.isLogiran) {
        alert("Wrong username/pass");
        this.loginRequest.username = "";
        this.loginRequest.password = "";
      } else if (x) {
        await this.router.navigate(["/homepage"]);
        this.snackBar.openSnackBarPlavi("Uspjesan login");
      }
    });

  }

  async onEnter($event: any) {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    console.log("enter kliknut!");
     this.signIn();
  }
}

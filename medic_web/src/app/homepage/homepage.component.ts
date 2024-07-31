import { Component } from '@angular/core';
import {AuthService} from "../helper/auth/myAuthService";
import {Router} from "@angular/router";

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {
  constructor(private authService:AuthService, private router:Router) {
  }
  logOut() {
    this.authService.signOut();
    this.router.navigate(["/login"])
  }
}

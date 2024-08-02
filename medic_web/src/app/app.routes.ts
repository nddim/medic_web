import { Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {HomepageComponent} from "./homepage/homepage.component";
import {AuthGuard, authGuardAdmin} from "./helper/guards/authGuard";

export const routes: Routes = [
  {path:'', component:LoginComponent},
  {path:'login', component:LoginComponent},
  {path:'homepage', component:HomepageComponent, canActivate:[authGuardAdmin]}
];

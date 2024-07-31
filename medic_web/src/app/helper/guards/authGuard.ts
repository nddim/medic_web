import {inject, Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from "@angular/router";
import {AuthService} from "../auth/myAuthService";

@Injectable({providedIn:'root'})
export class AuthGuard {
  constructor(private router:Router,
              private authService: AuthService) {
  }
  async canActivateAdmin():Promise<boolean>{
    const isLogged = await this.authService.getAuthToken();
    if (isLogged!=null){
      return true;
    }
    else{
      this.router.navigate(['/login']);
      return false;
    }
  }
}

export const authGuardAdmin: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  console.log("Usli smo u provjeru");
  return inject(AuthGuard).canActivateAdmin();
};

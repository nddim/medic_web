import {Injectable} from "@angular/core";
import {AuthDataService, LoginAuthRequest, LoginAuthResponse} from "./authDataService";
import {Observable, tap} from "rxjs";
import {AuthToken} from "./authToken";

@Injectable({providedIn: 'root'})
export class AuthService {

  constructor(private dataService : AuthDataService) {
  }

  getAuthToken(): any {
    if (typeof window !== 'undefined') {
      // window is available, proceed with accessing localStorage
      let tokenString = window.localStorage.getItem("my-auth-token") ?? "";
      try {
        return JSON.parse(tokenString);
      } catch (error) {
        return null;
      }
    } else {
      // window is not available, handle appropriately
      return null;
    }
  }

  setLogiraniKorisnik(x: AuthToken | null) {

    if (x == null){
      window.localStorage.setItem("my-auth-token", '');
    }
    else {
      window.localStorage.setItem("my-auth-token", JSON.stringify(x));
    }
  }

  signIn(loginRequest:LoginAuthRequest):Observable<LoginAuthResponse>{
    return this.dataService.login(loginRequest)
      .pipe(
        tap(x => {
          this.setLogiraniKorisnik(x.authToken);
        })
      );
  }

  async signOut():Promise<void> {
    const token = this.getAuthToken();

    if (token){
      try {
        await this.dataService.logout(token.value).toPromise();
      }
      catch(error){

      }
      this.setLogiraniKorisnik(null);
    }

  }
}

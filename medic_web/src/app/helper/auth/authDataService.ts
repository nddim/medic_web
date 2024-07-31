import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {MojConfig} from "../../../assets/moj-config";
import {AuthToken} from "./authToken";




@Injectable({providedIn: 'root'})
export class AuthDataService {
  constructor(private http:HttpClient) {
  }

  login(request:LoginAuthRequest){
    let url = MojConfig.adresa_local + 'login';
    return this.http.post<LoginAuthResponse>(url, request);
  }

  logout(tokenValue:string){
    let url = MojConfig.adresa_local + 'logout';
    const headers = new HttpHeaders({'Content-Type': 'application/json', 'my-auth-token': tokenValue});
    return this.http.post<void>(url, {}, {'headers' : headers});
  }
}

export interface LoginAuthRequest {
  username:string
  password:string
}
export interface LoginAuthResponse {
  authToken: AuthToken;
  isLogiran: boolean
}

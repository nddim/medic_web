import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {MojConfig} from "../../assets/moj-config";
import {AuthDataService} from "../helper/auth/authDataService";
import {AuthService} from "../helper/auth/myAuthService";

@Injectable({ providedIn: 'root' })
export class HomepageDataService {
    constructor(private http: HttpClient,
                private authService: AuthService,) {
    }
    getAll(){
      var url = MojConfig.adresa_local + 'users';
      var token = this.authService.getAuthToken().value;
      const headers = new HttpHeaders({'Content-Type': 'application/json', 'my-auth-token': token});
      return this.http.get<UsersGetAllResponse>(url, {'headers' : headers});
    }

    getById(id:number){
      var url = MojConfig.adresa_local + 'users/details/' + id.toString();
      var token = this.authService.getAuthToken().value;
      const headers = new HttpHeaders({'Content-Type': 'application/json', 'my-auth-token': token});
      return this.http.get<UsersGetResponse>(url, {'headers' : headers});
    }
    editUser(user:UsersGetResponse){
      var url = MojConfig.adresa_local + 'edit';
      var token = this.authService.getAuthToken().value;
      const headers = new HttpHeaders({'Content-Type': 'application/json', 'my-auth-token': token});
      return this.http.post(url, user, {'headers' : headers});
    }
    addUser(user:UserPost){
      var url = MojConfig.adresa_local + 'register';
      var token = this.authService.getAuthToken().value;
      const headers = new HttpHeaders({'Content-Type': 'application/json', 'my-auth-token': token});
      return this.http.post(url, user, {'headers' : headers});
    }

}
export type UsersGetAllResponse = UsersGetResponse[]

export interface UsersGetResponse {
  id: number
  name: string
  username: string
  orders: number
  lastLoginDate: string
  slikaUrl?: string
  status: string
  dateOfBirth: string
}
export interface UserPost {
  name: string
  username: string
  password: string
  orders: number
  slikaUrl: string
  dateOfBirth: string
}

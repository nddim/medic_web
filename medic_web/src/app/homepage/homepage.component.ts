import { Component } from '@angular/core';
import {AuthService} from "../helper/auth/myAuthService";
import {Router} from "@angular/router";
import {HomepageDataService, UserPost, UsersGetAllResponse, UsersGetResponse} from "./homepageDataService";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {
  constructor(private authService:AuthService,
              private router:Router,
              private dataService:HomepageDataService) {
  }
  ngOnInit(){
    this.getUsers();
  }
  logOut() {
    this.authService.signOut();
    this.router.navigate(["/login"])
  }
  openUserInfo:boolean=false;
  users:UsersGetResponse[] = [];
  usersPrikazi: any;

  getUsers(){
    this.dataService.getAll().subscribe(x => {
      this.users = x;
      this.usersPrikazi = this.users;
    });
  }

  getUserById(id:number){
    this.dataService.getById(id).subscribe(x => {
      this.selectedUser=x;
      this.selectedLastLoginDateString = this.extractDateFromDateTime(x.lastLoginDate);
      this.selectedDateOfBirthstring = this.extractDateFromDateTime(x.dateOfBirth);
    })
  }

  selectedUser:UsersGetResponse={
    id:0,
    name:"",
    username:"",
    orders:0,
    lastLoginDate:"",
    dateOfBirth:"",
    status:"",
    slikaUrl:"",
  };

  selectedDateOfBirthstring:string="";
  selectedLastLoginDateString:string="";

  extractDateFromDateTime(dateTimeString: string): string {
    // Extract the date part before the space or 'T' in the date-time string
    return dateTimeString.split(' ')[0].split('T')[0];
  }

  transformDateToString(date: Date): string {               // date to string
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are zero-based, so add 1
    const day = ('0' + date.getDate()).slice(-2); // Add leading zero if needed
    return `${year}-${month}-${day}`;
  }
  updateUser(){
    this.selectedUser.dateOfBirth = this.selectedDateOfBirthstring;
    var edited:UsersGetResponse={
      id:this.selectedUser.id,
      name:this.selectedUser.name,
      username:this.selectedUser.username,
      status:this.selectedUser.status,
      orders:this.selectedUser.orders,
      lastLoginDate:this.selectedUser.lastLoginDate,
      dateOfBirth:this.selectedUser.dateOfBirth
    };
    this.dataService.editUser(edited).subscribe(x => {
      this.openUserInfo=false;
      this.getUsers();
    })
  }

  openAddUser:boolean=false;
  newUser:UserPost={
    password:"",
    name:"",
    username:"",
    orders:0,
    dateOfBirth:"",
    slikaUrl:"",
  };
  newDateOfBirth:Date=new Date();
  registerUser(){
    debugger
    var newUser:UserPost={
      name:this.newUser.name,
      username:this.newUser.username,
      password:this.newUser.password,
      orders:this.newUser.orders,
      dateOfBirth:this.transformDateToString(this.newDateOfBirth),
      slikaUrl:this.newUser.slikaUrl
    };
    this.dataService.addUser(newUser).subscribe(x=>{
      this.openAddUser=false;
      this.getUsers();
    });
  }
}

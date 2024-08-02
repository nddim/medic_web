import {ChangeDetectorRef, Component} from '@angular/core';
import {AuthService} from "../helper/auth/myAuthService";
import {Router} from "@angular/router";
import {HomepageDataService, UserImage, UserPost, UsersGetAllResponse, UsersGetResponse} from "./homepageDataService";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {SnackbarBar} from "../helper/mat-snackbar/snack-bar";

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
              private dataService:HomepageDataService,
              private snackBar: SnackbarBar) {
  }
  ngOnInit(){
    this.getUsers();
  }
  logOut() {
    this.authService.signOut();
    this.router.navigate(["/login"])
    this.snackBar.openSnackBarPlavi("Uspjesan logout");
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
      this.editedImage=this.selectedUser.slikaUrl;
      this.selectedLastLoginDateString = this.extractDateFromDateTime(x.lastLoginDate);
      this.selectedDateOfBirthstring = this.extractDateFromDateTime(x.dateOfBirth);
    })
  }

  blockById(id:number){
    this.dataService.blockById(id).subscribe(x => {
      this.openUserInfo=false;
      this.snackBar.openSnackBarPlavi("User blocked");
    })
  }

  //details and edit
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
      this.snackBar.openSnackBarPlavi("User updated!");
    },
      error => {
        if(error.status===400) {
          this.snackBar.openSnackBarCrveniRight("Bad request error: Invalid data input.")
        } else {
          // alert("An unexpected error occurred.");
          this.snackBar.openSnackBarCrveniRight("An unexpected error occurred.")
        }
      }
      );
    if(this.changeImage){
      this.dataService.editImage(this.userImage).subscribe(x=>{
        this.openUserInfo=false;
        this.getUsers();
        this.changeImage=false;
        this.snackBar.openSnackBarPlavi("User updated!");
      })
    }
  }

  //adding user
  novaSlika:any;

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
      this.resetNewUser();
      this.snackBar.openSnackBarPlavi("User added!");
    },
      error => {
        if(error.status===400) {
          this.snackBar.openSnackBarCrveniRight("Bad request error: Invalid data input.")
        } else {
          // alert("An unexpected error occurred.");
          this.snackBar.openSnackBarCrveniRight("An unexpected error occurred.")
        }
      });
  }
  resetNewUser(){
    this.newUser={
      name:"",
      username:"",
      password:"",
      orders:0,
      dateOfBirth:"",
      slikaUrl:""
    }
  }
  generisiPreviewSlike() {
    // @ts-ignore
    let f = document.getElementById("slika-input").files[0];
    if (f && this.newUser) {
      let fileReader = new FileReader();
      fileReader.onload = async (e: any) => {
        try {
          const originalImageUrl = fileReader.result!.toString();
          const resizedImageUrl = await this.resizeImage(originalImageUrl);

          this.adjustImageToSquare(resizedImageUrl, (adjustedImage: string) => {
            this.newUser.slikaUrl = adjustedImage;
            this.novaSlika = this.newUser.slikaUrl;
          });
        } catch (error) {
        }
      };
      fileReader.readAsDataURL(f);
    }
  }

  async resizeImage(imageUrl: string): Promise<string> {
    // Učitaj sliku koristeći Image objekt
    const img = new Image();
    img.src = imageUrl;

    // Sačekaj da se slika učita
    await new Promise(resolve => {
      img.onload = resolve;
    });

    // Ako je najveća dimenzija veća od 800, smanji veličinu slike srazmjerno
    let targetWidth, targetHeight;
    if (Math.max(img.width, img.height) > 800) {
      if (img.width > img.height) {
        targetWidth = 800;
        targetHeight = Math.round((800 / img.width) * img.height);
      } else {
        targetHeight = 800;
        targetWidth = Math.round((800 / img.height) * img.width);
      }
    } else {
      targetWidth = img.width;
      targetHeight = img.height;
    }

    // Stvori canvas za smanjenje veličine slike
    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');

    // Smanji sliku na canvasu
    ctx!.drawImage(img, 0, 0, targetWidth, targetHeight);

    // Pretvori canvas u URL slike
    const resizedImageUrl = canvas.toDataURL('image/png'); // Možete koristiti 'image/png' ako želite PNG format

    return resizedImageUrl;
  }

  adjustImageToSquare(imageDataUrl: string, callback: (adjustedImage: string) => void) {
    const img = new Image();
    img.src = imageDataUrl;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const maxDimension = Math.max(img.width, img.height);

      canvas.width = maxDimension;
      canvas.height = maxDimension;

      const offsetX = (maxDimension - img.width) / 2;
      const offsetY = (maxDimension - img.height) / 2;

      ctx!.fillStyle = '#ffffff'; // Bijela boja
      ctx!.fillRect(0, 0, maxDimension, maxDimension);
      ctx!.drawImage(img, offsetX, offsetY, img.width, img.height);

      const adjustedImageDataUrl = canvas.toDataURL('image/png'); // Možete koristiti 'image/png' ako želite PNG format

      callback(adjustedImageDataUrl);
    };
  }

  changeImage=false;
  editedImage:any;

  userImage:UserImage={
    slika:"",
    id:0
  }

  generisiPreviewSlikeEdit(){
    // @ts-ignore
    let f=document.getElementById("slika-edit").files[0];
    if(f && this.selectedUser){
      let fileReader=new FileReader();

      fileReader.onload = async (e:any) => {
        try{
          const originalImageUrl=fileReader.result!.toString();
          const resizedImageUrl=await this.resizeImage(originalImageUrl);

          this.adjustImageToSquare(resizedImageUrl, (adjustedImage: string) => {
            this.userImage.id=this.selectedUser.id;
            this.userImage.slika=adjustedImage;
            this.editedImage=this.userImage.slika;
            this.changeImage=true;
          });

        } catch (error){
        }
      };
      fileReader.readAsDataURL(f);
    }
  }
}

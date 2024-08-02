import {Injectable} from "@angular/core";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({providedIn:'root'})
export class SnackbarBar {
  constructor(private _snackBar: MatSnackBar) {
  }

  openSnackBarPlavi(poruka:string, action="") {
    this._snackBar.open(poruka,action, {
      duration:2000,
      verticalPosition:'top',
      horizontalPosition:"center",
      panelClass:['plavi-snackbar'],
    })
  }
  openSnackBarCrveni(poruka:string, action="") {
    this._snackBar.open(poruka,action, {
      duration:3000,
      verticalPosition:'top',
      horizontalPosition:"center",
      panelClass:['crveni-snackbar'],
    })
  }
  openSnackBarCrveniRight(poruka:string, action="") {
    this._snackBar.open(poruka,action, {
      duration:3000,
      verticalPosition:'top',
      horizontalPosition:"right",
      panelClass:['right-crveni-snackbar'],
    })
  }
}

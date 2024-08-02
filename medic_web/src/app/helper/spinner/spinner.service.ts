import {BehaviorSubject} from "rxjs";
import {Injectable} from "@angular/core";
import {NgxSpinnerService} from "ngx-spinner";

@Injectable({providedIn: 'root'})
export class SpinnerService {

  constructor(private ngxSpinnerService: NgxSpinnerService) {}
  private spinnerCounter = new BehaviorSubject<number>(0);
  spinnerCounter$ = this.spinnerCounter.asObservable();
  show() {
    this.ngxSpinnerService.show();
  }

  hide() {
    this.ngxSpinnerService.hide();
  }
}
